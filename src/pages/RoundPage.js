// src/pages/RoundPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../features/round/LoadingSpinner';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import '../styles/roundpage.css';

function RoundPage() {
    const disableTimer = false;
    const [timer, setTimer] = useState(30);
    const [isAnswered, setIsAnswered] = useState(false);
    const [hasTimerExpired, setHasTimerExpired] = useState(false);
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
    const [qBankID, setQBankID] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [totalAnswerTime, setTotalAnswerTime] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [questionsAnswered, setQuestionsAnswered] = useState(0);
    const [showCorrectOverlay, setShowCorrectOverlay] = useState(false);
    const [showIncorrectOverlay, setShowIncorrectOverlay] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [roundID, setRoundID] = useState(null);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [currentRound, setCurrentRound] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRoundByDifficulty = async () => {
            try {
                console.log("Starting fetchRoundByDifficulty...");
                const token = localStorage.getItem('token');
                const decoded = jwtDecode(token);
                const userID = decoded.userId;
                console.log("User ID:", userID);
    
                // Fetch the difficulty First
                const difficultyResponse = await axios.get('http://localhost:5000/api/performance/students/get-difficulty', { 
                    params: { userID } 
                });
    
                const difficulty = difficultyResponse.data.difficulty;
                console.log("Fetched Difficulty:", difficulty);
                
                // Fetch the round based on the chosen difficulty above
                const roundResponse = await axios.get('http://localhost:5000/api/round/select-by-difficulty', {
                    params: { difficulty }
                });
    
                const round = roundResponse.data;
                setRoundID(round.roundID); 
                setQBankID(round.QBankID);    
    
            } catch (error) {
                console.error('Error fetching round by difficulty:', error);
            }
        };
    
        fetchRoundByDifficulty();
    }, []);
    
    // New useEffect to fetch questions only when qBankID is defined
    useEffect(() => {
        if (qBankID !== null) {
            const fetchQuestion = async () => {
                try {
                    console.log("Fetching questions...");
                    const response = await axios.get('http://localhost:5000/api/round/get-question', {
                        params: { qBankID, questionIndex },
                    });
    
                    const questionData = response.data;
    
                    if (!questionData) {
                        console.log("No more questions available. Ending round...");
                        handleRoundComplete();
                        return;
                    }
    
                    console.log("Fetched Question:", questionData);
    
                    let parsedAnswers = [];
                    try {
                        parsedAnswers = JSON.parse(questionData.AnswerOptions).map((option) => option.option);
                    } catch (e) {
                        console.error("Failed to parse answer options:", e);
                    }
    
                    setCurrentQuestion({
                        questionID: questionData.QuestionID,
                        context: questionData.QuestionContext,
                        text: questionData.QuestionText,
                    });
                    setAnswers(parsedAnswers);
                    setTotalQuestions(parsedAnswers.length); // Store the total questions for the round
                } catch (error) {
                    console.error("Error fetching question:", error);
                    handleRoundComplete();
                }
            };
    
            fetchQuestion();
        }
    }, [qBankID, questionIndex]);
    
    


    // Handle end of the round
    const handleRoundComplete = async () => {
        console.log("Handling round completion...");
    
        const userID = jwtDecode(localStorage.getItem('token')).userId;
        const completionRate =
            totalQuestions > 0 ? (questionsAnswered / totalQuestions) * 100 : 0;
    
        const roundStats = {
            correctAnswersCount,
            totalQuestions,
            totalAnswerTime,
            totalAttempts: attempts,
            roundsPlayed: currentRound,
            totalRoundsAvailable: 10,
            completionRate,
            userID,
        };
    
        console.log("Round Stats:", roundStats);
    
        try {
            const metricResponse = await axios.post(
                'http://localhost:5000/api/metric/calculate-metrics',
                roundStats
            );
        
            const userID = jwtDecode(localStorage.getItem('token')).userId;
            const { metrics } = metricResponse.data;
        
            const metricsWithUserID = {
                ...metrics,
                userID: parseInt(userID, 10), // Ensure userID is an integer
                totalRoundsPlayed: parseInt(metrics.totalRoundsPlayed, 10),
                averageAnswerTime: parseFloat(metrics.averageAnswerTime),
                accuracyRate: parseFloat(metrics.accuracyRate),
                attemptsPerQuestion: parseFloat(metrics.attemptsPerQuestion),
                completionRate: parseFloat(metrics.completionRate),
                consistencyScore: parseFloat(metrics.consistencyScore),
            };
            
        
            console.log("Calculated Metrics with UserID:", metricsWithUserID);
        
            const updateResponse = await axios.post(
                'http://localhost:5000/api/performance/students/update-metrics',
                metricsWithUserID
            );
        
            navigate("/dashboard");
        } catch (error) {
            console.error("Error updating performance metrics:", error);
            navigate("/dashboard");
        }
        
    };
    
    
    
    


    const handleNextQuestion = () => {
        // Increment the question index
        if (answers.length > 0) {
            setQuestionIndex((prevIndex) => prevIndex + 1);
            setCurrentRound((prevRound) => prevRound + 1);
        } else {
            handleRoundComplete(); // End the round if no more answers are available
        }
    };



    const handleAnswerAndAdvance = async (selectedAnswer) => {
        if (isAnswered) return;
        setIsAnswered(true);
        setAttempts((prev) => prev + 1);
    
        const startTime = Date.now();
    
        try {
            const response = await axios.post('http://localhost:5000/api/round/validate-answer', {
                questionID: currentQuestion.questionID,
                selectedAnswer,
            });
    
            const { isCorrect } = response.data;
    
            if (isCorrect) {
                setCorrectAnswersCount((prev) => prev + 1);
                setShowCorrectOverlay(true);
                setTimeout(() => setShowCorrectOverlay(false), 500);
            } else {
                setShowIncorrectOverlay(true);
                setTimeout(() => setShowIncorrectOverlay(false), 500);
            }
    
            const answerTime = (Date.now() - startTime) / 1000;
            setTotalAnswerTime((prev) => prev + answerTime);
            setQuestionsAnswered((prev) => prev + 1);

            setTimeout(() => {
                handleNextQuestion();
            }, 1000);
        } catch (error) {
            console.error("Error validating answer:", error);
        }
    };
    
    



    // Timer logic
    useEffect(() => {
        if (disableTimer) {
            return;
        }

        if (timer > 0 && !isAnswered) {
            const timerInterval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);

            return () => clearInterval(timerInterval);
        } else if (timer === 0 && !isAnswered) {
            handleTimeout(); // Handle timeout when timer reaches 0
        }
    }, [timer, isAnswered]);



    // Handle timeout
    const handleTimeout = () => {
        console.log("Handling timeout...");
        if (!isAnswered) {
            setIsAnswered(true);
            setShowIncorrectOverlay(true); 
            setTimeout(() => {
                setShowIncorrectOverlay(false);
                handleNextQuestion(); 
            }, 1000); // Delay before advancing
        }
    };



    // Reset the timer whenever a new question is loaded
    useEffect(() => {
        if (currentQuestion) {
            console.log("Resetting state for new question...");
            setTimer(30); // Reset to 30 seconds
            setHasTimerExpired(false); 
            setIsAnswered(false); 
            setShowCorrectOverlay(false); 
            setShowIncorrectOverlay(false); 
        }
    }, [currentQuestion]);

    return (
        <div className="round-page">
            {currentQuestion ? (
                <div className={`round-container ${showCorrectOverlay ? 'correct-overlay' : ''}`}>
                    {showCorrectOverlay && (
                        <div className="tick-mark-overlay"></div>
                    )}
                    <section className="question-timer-container">
                        <span className="questionNum noselect">
                            Question: {currentRound}
                        </span>
                        <span className="timer noselect">Timer: {timer}s</span>
                        <section className="starProgress">
                        </section>
                    </section>

                    <section className="question-container">
                        <div className="question-context-container noselect">
                            <span>{currentQuestion.context}</span>
                        </div>
                        <div className="question-text-container noselect">
                            <span>{currentQuestion.text}</span>
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
