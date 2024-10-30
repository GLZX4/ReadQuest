// src/pages/RoundPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../features/round/LoadingSpinner';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import '../styles/roundpage.css';

function RoundPage() {
    const disableTimer = true;
    const [timer, setTimer] = useState(30);
    const [isAnswered, setIsAnswered] = useState(false);
    const [hasTimerExpired, setHasTimerExpired] = useState(false);
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
    const [qBankID, setQBankID] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [showCorrectOverlay, setShowCorrectOverlay] = useState(false);
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
    
                const difficultyResponse = await axios.get('http://localhost:5000/api/performance/students/get-difficulty', { 
                    params: { userID } 
                });
    
                const difficulty = difficultyResponse.data.difficulty;
                console.log("Fetched Difficulty:", difficulty);
    
                const roundResponse = await axios.get('http://localhost:5000/api/round/select-by-difficulty', {
                    params: { difficulty }
                });
    
                const round = roundResponse.data;
                setRoundID(round.roundID);    // Set roundID
                setQBankID(round.QBankID);    // Set qBankID
                console.log("Set RoundID:", round.roundID);
                console.log("Set QBankID:", round.QBankID);
    
            } catch (error) {
                console.error('Error fetching round by difficulty:', error);
            }
        };
    
        fetchRoundByDifficulty();
    }, []);
    
    // New useEffect to fetch questions only when qBankID is defined
    useEffect(() => {
        if (qBankID !== null) {  // Check if qBankID is available before calling fetchQuestion
            console.log("qBankID is set:", qBankID);
            console.log("Current questionIndex:", questionIndex);
    
            const fetchQuestion = async () => {
                try {
                    console.log("Starting fetchQuestion with qBankID:", qBankID, "and questionIndex:", questionIndex);
                    const response = await axios.get('http://localhost:5000/api/round/get-question', {
                        params: { qBankID, questionIndex }
                    });
    
                    const questionData = response.data;
                    console.log("Fetched Question Data:", questionData);
    
                    let parsedAnswers = [];
                    try {
                        parsedAnswers = JSON.parse(questionData.AnswerOptions).map(option => option.option);
                        console.log("Parsed Answer Options:", parsedAnswers);
                    } catch (e) {
                        console.error("Failed to parse AnswerOptions:", e);
                    }
    
                    setCurrentQuestion({
                        questionID: questionData.QuestionID,
                        context: questionData.QuestionContext,
                        text: questionData.QuestionText,
                    });
                    setAnswers(parsedAnswers);
    
                } catch (error) {
                    console.error('Error fetching question:', error);
                }
            };
    
            setTimer(30); // Reset the timer
            fetchQuestion();
        } else {
            console.log("qBankID is not set yet. Waiting for qBankID...");
        }
    }, [qBankID, questionIndex]);  // Run only when qBankID and questionIndex are available

    
    const handleNextQuestion = () => {
        setQuestionIndex((prevIndex) => prevIndex + 1);
    };

    const handleAnswerAndAdvance = async (selectedAnswer) => {
        setIsAnswered(true);

        try {
            const response = await axios.post('http://localhost:5000/api/round/validate-answer', {
                questionID: currentQuestion.questionID,
                selectedAnswer,
            });

            const { isCorrect } = response.data;

            if (isCorrect) {
                setCorrectAnswersCount(prev => prev + 1);
                setShowCorrectOverlay(true); // Show correct overlay briefly
                setTimeout(() => setShowCorrectOverlay(false), 500);
            }

            setTimeout(() => {
                handleNextQuestion();
            }, 1000); // Adjust delay if needed

        } catch (error) {
            console.error('Error validating answer:', error);
        }
    };

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
