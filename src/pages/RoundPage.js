// src/pages/RoundPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/common/LoadingSpinner";
import QuestionRenderer from "../components/questions/QuestionRenderer";
import Alerter from "../components/common/alerter";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import startSound1 from "../assets/audio/newRound.wav";
import startSound2 from "../assets/audio/newRound2.wav";
import startSound3 from "../assets/audio/newRound3.wav";
import "../styles/roundpage.css";

function RoundPage() {
  const disableTimer = false;
  const [timer, setTimer] = useState(90);
  const [hasPlayedRoundSound, setHasPlayedRoundSound] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [hasTimerExpired, setHasTimerExpired] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [qBankID, setQBankID] = useState(null);
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
  const [question, setQuestion] = useState(null);
  const [currentRound, setCurrentRound] = useState(1);
  const [showRoundCompleteOverlay, setShowRoundCompleteOverlay] = useState(false);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  const roundStartSounds = [startSound1, startSound2, startSound3];

  useEffect(() => {
    const fetchRoundByDifficulty = async () => {
      try {
        const token = localStorage.getItem("token");
        const decoded = jwtDecode(token);
        const userID = decoded.userId;

        const difficultyResponse = await axios.get(
          "http://localhost:5000/api/performance/students/get-difficulty",
          { params: { userID, token } }
        );
        const difficulty = difficultyResponse.data.difficulty;

        const roundResponse = await axios.get(
          "http://localhost:5000/api/round/select-by-difficulty",
          {
            params: { difficulty },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const round = roundResponse.data;
        setRoundID(round.roundid);
        setQBankID(round.qbankid);
      } catch (error) {
        console.error("Error fetching round by difficulty:", error);
      }
    };

    fetchRoundByDifficulty();
  }, []);

  useEffect(() => {
    if (qBankID !== null) {
      if (!hasPlayedRoundSound) {
        const randomSound = new Audio(roundStartSounds[Math.floor(Math.random() * roundStartSounds.length)]);
        randomSound.play().catch(e => console.warn("🔇 Failed to play round-start sound:", e));
        setHasPlayedRoundSound(true);
      }

      const fetchQuestion = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            "http://localhost:5000/api/round/get-question",
            { params: { qBankID, questionIndex, token } }
          );

          const questionData = response.data;

          if (!questionData) {
            handleRoundComplete();
            return;
          } else {
            setQuestion(questionData);
            console.log("Fetched Question:", questionData);
          }

          const answerOptionsData = typeof questionData.answeroptions === "string"
            ? JSON.parse(questionData.answeroptions)
            : questionData.answeroptions;

          setCurrentQuestion({
            questionID: questionData.questionid,
            context: questionData.questioncontext,
            text: questionData.questiontext,
          });

          setAnswers(answerOptionsData); 
          setTotalQuestions((prevIndex) => prevIndex + 1);
        } catch (error) {
          handleRoundComplete();
        }
      };

      fetchQuestion();
    }
  }, [qBankID, questionIndex]);

  const handleRoundComplete = async () => {
    console.log("Handling round completion...");
    const token = localStorage.getItem("token");
    const userID = jwtDecode(token).userId;
    const completionRate = totalQuestions > 0 ? (questionsAnswered / totalQuestions) * 100 : 0;

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

    try {
      const response = await axios.post(
        "http://localhost:5000/api/metric/process-metrics",
        roundStats,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await updateAchievementProgress("roundsPlayed", 1);
      await updateStreakProgress(userID);

      navigate("/dashboard");
    } catch (error) {
      setAlert({ message: "Failed to update achievements: " + error.message, type: "error" });
    }
  };

  const updateAchievementProgress = async (metric, value) => {
    const token = localStorage.getItem("token");
    const userID = jwtDecode(token).userId;

    try {
      await axios.post(
        "http://localhost:5000/api/achievement/update-progress",
        { studentId: userID, metric, value },
        { params: { token } }
      );
    } catch (error) {
      console.error("Error updating achievement progress:", error);
    }
  };

  const updateStreakProgress = async (studentId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/student/update-streak",
        { studentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      setAlert({ message: "Error updating Streak: " + error.message, type: "error" });
    }
  };

  const handleNextQuestion = () => {
    if (answers.length > 0 && questionIndex + 1 < totalQuestions) {
      setQuestionIndex((prevIndex) => prevIndex + 1);
      setCurrentRound((prevRound) => prevRound + 1);
    } else {
      setQuestion(null);
      setShowRoundCompleteOverlay(true);
      setTimeout(() => {
        handleRoundComplete();
      }, 1500);
    }
  };
  
  

  const handleAnswerAndAdvance = async (selectedAnswer) => {
    if (isAnswered) return;
    setIsAnswered(true);
    setAttempts((prev) => prev + 1);

    const endTime = Date.now();
    const answerTime = (endTime - startTime) / 1000;

    setTotalAnswerTime((prev) => prev + answerTime);

    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/round/validate-answer",
        {
          questionID: currentQuestion.questionID,
          selectedAnswer,
          token
        }
      );

      const isCorrect = response.data;
      if (isCorrect) {
        setCorrectAnswersCount((prev) => prev + 1);
        setShowCorrectOverlay(true);
        setTimeout(() => setShowCorrectOverlay(false), 500);
      } else {
        setShowIncorrectOverlay(true);
        setTimeout(() => setShowIncorrectOverlay(false), 500);
      }

      setQuestionsAnswered((prev) => prev + 1);

      setTimeout(() => {
        handleNextQuestion();
      }, 1000);
    } catch (error) {
      console.error("Error validating answer:", error);
    }
  };

  useEffect(() => {
    if (disableTimer) return;
    if (timer > 0 && !isAnswered) {
      const timerInterval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timerInterval);
    } else if (timer === 0 && !isAnswered) {
      handleTimeout();
    }
  }, [timer, isAnswered, disableTimer]);

  const handleTimeout = () => {
    if (!isAnswered) {
      setIsAnswered(true);
      setShowIncorrectOverlay(true);
      setTimeout(() => {
        setShowIncorrectOverlay(false);
        handleNextQuestion();
      }, 1000);
    }
  };

  useEffect(() => {
    if (currentQuestion) {
      setTimer(30);
      setHasTimerExpired(false);
      setIsAnswered(false);
      setShowCorrectOverlay(false);
      setShowIncorrectOverlay(false);

      const questionStartTime = Date.now();
      setStartTime(questionStartTime);
    }
  }, [currentQuestion]);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  return (
    <>
      {showRoundCompleteOverlay && (
        <motion.div
          className="round-complete-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Round Complete!</h1>
        </motion.div>
      )}
  
      <div className="round-page">
        {alert && <Alerter message={alert.message} type={alert.type} />}
  
        <AnimatePresence mode="wait">
          {question ? (
            <motion.div
              key={questionIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.4 }}
            >
              <QuestionRenderer question={question} onAnswer={handleAnswerAndAdvance} timer={timer} />
            </motion.div>
          ) : (
            <LoadingSpinner />
          )}
        </AnimatePresence>
      </div>
    </>
  );
  
}

export default RoundPage;
