// src/pages/RoundPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../features/round/LoadingSpinner';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import '../styles/roundpage.css';

function RoundPage() {
    const disableTimer = true;
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
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRoundByDifficulty = async () => {
            try {
                const token = localStorage.getItem('token');
                const decoded = jwtDecode(token);
                const userID = decoded.userId;
    
                const difficultyResponse = await axios.get('http://localhost:5000/api/performance/students/get-difficulty', { 
                    params: { userID } 
                });
    
                const difficulty = difficultyResponse.data.difficulty;
                console.log('Fetched Difficulty:', difficulty);
    
                const roundResponse = await axios.get('http://localhost:5000/api/round/select-by-difficulty', {
                    params: { difficulty }
                });
    
                const round = roundResponse.data;
                console.log('Fetched Round:', round);
    
                const questionBankResponse = await axios.get('http://localhost:5000/api/round/retrieve-qBank', {
                    params: { QBankID: round.QBankID }
                });
    
                const questions = questionBankResponse.data;
                console.log('Fetched Question Bank:', questions);
    
                if (questions.length > 0) {
                    setQuestionBank(questions);  // Store all questions in the bank
                    setCurrentRound(1);          // Start at the first question
                } else {
                    console.error('Question Bank is empty or invalid');
                }
            } catch (error) {
                console.error('Error fetching round by difficulty:', error);
            }
        };
    
        fetchRoundByDifficulty();
    }, []);
    

    // Load the initial question once the question bank is set
    useEffect(() => {
        if (questionBank.length > 0) {
            loadQuestion(currentRound - 1);
        }
    }, [questionBank, currentRound]);

    // Load each question and initialize state
    const loadQuestion = (questionIndex) => {
        if (questionBank[questionIndex]) {
            const questionData = questionBank[questionIndex];
            console.log('Question Data:', questionData.QuestionText);
            setCurrentQuestion(questionData.QuestionText);

            // Parse AnswerOptions if it's a JSON string
            let parsedAnswers = [];
            try {
                parsedAnswers = JSON.parse(questionData.AnswerOptions).map(option => option.option);
            } catch (e) {
                console.error("Failed to parse AnswerOptions:", e);
            }
            
            setAnswers(parsedAnswers);
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

    // Handle answer submission and load the next question
    const handleAnswerAndAdvance = (selectedAnswer) => {
        setAttempts((prevAttempts) => prevAttempts + 1);
        const timeTaken = (Date.now() - startTime) / 1000;
        setAnswerTimes((prevTimes) => [...prevTimes, timeTaken]);
        setIsAnswered(true);
    
        // Verify that currentQuestion exists and has the correct answer
        if (currentQuestion && selectedAnswer === currentQuestion.correctAnswer) {
            setCorrectAnswersCount((prevCount) => prevCount + 1);
        }
    
        setTimeout(() => {
            if (currentRound < questionBank.length) {
                setCurrentRound((prevRound) => prevRound + 1);
            } else {
                console.log("Round completed");
                console.log("Accuracy Rate:", calculateAccuracyRate() + "%");
                console.log("Average Attempts per Question:", calculateAverageAttempts());
                console.log("Average Answer Time:", calculateAverageAnswerTime() + "s");
                navigate('/dashboard'); // Navigate after displaying metrics
            }
        }, 500);
    };

    const handleNextRound = () => {
        setHasTimerExpired(false);
        setIsAnswered(false);
        if (currentRound < questionBank.length) {
            setCurrentRound((prevRound) => prevRound + 1);
        } else {
            //navigate to dashboard
            console.log("Round completed");
            
            navigate('/dashboard');
        }
    };

    // Utility functions for calculating metrics
    const calculateAverageAnswerTime = () => {
        if (answerTimes.length === 0) return 0;
        const sum = answerTimes.reduce((acc, time) => acc + time, 0);
        return (sum / answerTimes.length).toFixed(2);
    };

    const calculateAccuracyRate = () => {
        if (questionBank.length === 0) return 0;
        return ((correctAnswersCount / questionBank.length) * 100).toFixed(2);
    };

    const calculateAverageAttempts = () => {
        if (questionBank.length === 0) return 0;
        return (attempts / questionBank.length).toFixed(2);
    };

    const questionsPerStar = Math.ceil(questionBank.length / 5);
    const litStars = Math.floor((currentRound - 1) / questionsPerStar);

    return (
        <div className="round-page">
            {currentQuestion ? (
                <div className="round-container">
                    <section className="question-timer-container">
                        <span className="questionNum noselect">
                            Question: {currentRound}/{questionBank.length}
                        </span>
                        <span className="timer noselect">Timer: {timer}s</span>
                        <section className="starProgress">
                            {[...Array(5)].map((_, index) => (
                                <div key={index} className={`star ${index < litStars ? "lit" : ""}`}></div>
                            ))}
                        </section>
                    </section>

                    <section className="question-container">
                        <div className="question-context-container noselect">
                            <span>{currentQuestion}</span>
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
