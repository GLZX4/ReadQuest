// src/pages/RoundPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../features/rounds/LoadingSpinner';
import '../styles/roundpage.css';

function RoundPage() {
    const disableTimer = true; // Set this to `true` to disable the timer in development
    const questionBankID = useParams();
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [currentRound, setCurrentRound] = useState(1);
    const [timer, setTimer] = useState(30);
    const [isAnswered, setIsAnswered] = useState(false);
    const [questionBank, setQuestionBank] = useState([]);
    const [hasTimerExpired, setHasTimerExpired] = useState(false);
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
    const [answerTimes, setAnswerTimes] = useState([]);
    const [startTime, setStartTime] = useState(null);
    const [attempts, setAttempts] = useState(0);
  
    useEffect(() => {
        // Mock function to fetch the question bank data (this would be replaced with an API call)
        const fetchQuestionBank = async (qBankID) => {
            console.log(`Fetching question bank for ID: ${qBankID}`); // Debugging log
            if (!qBankID) {
                console.error("No question bank ID provided.");
                return;
            }

            try {
                await new Promise(resolve => setTimeout(resolve, 500));

                const fetchedQuestionBank = [
                    {
                        questionContext: `Context for question 1 in bank ${qBankID}`,
                        questionText: `What is the answer to question 1 in bank ${qBankID}?`,
                        options: ["Option A", "Option B", "Option C", "Option D"],
                        correctAnswer: "Option A"
                    },
                    {
                        questionContext: `Context for question 2 in bank ${qBankID}`,
                        questionText: `What is the answer to question 2 in bank ${qBankID}?`,
                        options: ["Option A", "Option B", "Option C", "Option D"],
                        correctAnswer: "Option B"
                    }
                ];

                if (Array.isArray(fetchedQuestionBank) && fetchedQuestionBank.length > 0) {
                    setQuestionBank(fetchedQuestionBank);
                } else {
                    console.error('Fetched Question Bank is empty or invalid');
                }
            } catch (error) {
                console.error('Error fetching question bank:', error);
            }
        };

        if (questionBankID) {
            fetchQuestionBank(questionBankID);
        }
    }, [questionBankID]);

    useEffect(() => {
        if (questionBank.length > 0) {
            loadQuestion(currentRound - 1);
        }
    }, [questionBank, currentRound]);

    // Start timer when the question is loaded
    const loadQuestion = (questionIndex) => {
        if (questionBank[questionIndex]) {
            const questionData = questionBank[questionIndex];
            setCurrentQuestion(questionData);
            setAnswers(questionData.options);
            setIsAnswered(false);
            setTimer(30); // Reset the timer
            setStartTime(Date.now()); // Record the start time
            setAttempts(0); // Reset attempts for the new question
        }
    };

    // Timer logic
    useEffect(() => {
        if (disableTimer) {
            return;
        }

        if (timer > 0 && !isAnswered && !hasTimerExpired) {
            const timerInterval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timerInterval);
        } else if (timer === 0 && !hasTimerExpired) {
            setHasTimerExpired(true);
            handleNextRound();
        }
    }, [timer, isAnswered, hasTimerExpired]);

    // Function to handle answer submission and update progress
    const handleAnswerAndAdvance = (selectedAnswer) => {
        setAttempts(prevAttempts => prevAttempts + 1); // Increment the attempts
        const timeTaken = (Date.now() - startTime) / 1000; // Time in seconds
        setAnswerTimes(prevTimes => [...prevTimes, timeTaken]); // Store the time taken
        setIsAnswered(true);
        
        // Check if answer is correct
        if (selectedAnswer === currentQuestion.correctAnswer) {
            setCorrectAnswersCount(prevCount => prevCount + 1);
        }

        // Immediately proceed to the next round after answering
        setTimeout(() => {
            if (currentRound < questionBank.length) {
                setCurrentRound(prevRound => prevRound + 1);
            } else if (currentRound === questionBank.length) {
                console.log("Round completed");
                console.log("Accuracy Rate:", calculateAccuracyRate() + "%");
                console.log("Average Attempts per Question:", calculateAverageAttempts());
            }
        }, 500); // Adding a small delay for UX purposes
    };

    // Function to load the next round
    const handleNextRound = () => {
        setHasTimerExpired(false); // Reset timer expired status
        setIsAnswered(false); // Enable buttons for the next question
        if (currentRound < questionBank.length) {
            setCurrentRound(prevRound => prevRound + 1);
        } else if (currentRound === questionBank.length) {
            console.log("Round completed");
        }
    };

    const calculateAverageAnswerTime = () => {
        const sum = answerTimes.reduce((acc, time) => acc + time, 0);
        return (sum / answerTimes.length).toFixed(2); // Returning with 2 decimal places
    };

    const calculateAccuracyRate = () => {
        return ((correctAnswersCount / questionBank.length) * 100).toFixed(2);
    };

    const calculateAverageAttempts = () => {
        return (attempts / questionBank.length).toFixed(2);
    };

    // Calculate the number of questions per star
    const questionsPerStar = Math.ceil(questionBank.length / 5); // Divide the number of questions by 5
    const litStars = Math.floor((currentRound - 1) / questionsPerStar); // Calculate how many stars to light

    return (
        <div className="round-page">
            {currentQuestion ? (
                <div className="round-container">

                    <section className="question-timer-container">
                        <span className="questionNum noselect">Question: {currentRound}/{questionBank.length}</span>
                        <span className="timer noselect">Timer: {timer}s</span>
                        <section className="starProgress">
                            {[...Array(5)].map((_, index) => (
                                <div key={index} className={`star ${index < litStars ? "lit" : ""}`}></div>
                            ))}
                        </section>
                    </section>

                    <section className="question-container">
                        <div className="question-context-container noselect">
                            <span>{currentQuestion.questionContext}</span>
                        </div>
                        <div className="question-text-container noselect">
                            <span>{currentQuestion.questionText}</span>
                        </div>
                    </section>

                    <section className="answers-container">
                        {answers.map((answer, index) => (
                            <button
                                key={index}
                                className={`answer-button answer-${index + 1}`}
                                onClick={() => handleAnswerAndAdvance(answer)}
                                disabled={isAnswered}
                            >
                                {answer}
                            </button>
                        ))}
                    </section>
                </div>
            ) : (
                <LoadingSpinner />
            )}
        </div>
    );
}

export default RoundPage;
