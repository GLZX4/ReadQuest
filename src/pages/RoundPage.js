// src/pages/RoundPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../features/round/LoadingSpinner";
import QuestionRenderer from "../components/QuestionRenderer";
import Alerter from "../components/alerter";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "../styles/roundpage.css";

function RoundPage() {
  const disableTimer = false;
  const [timer, setTimer] = useState(90);
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
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoundByDifficulty = async () => {
      console.log("Fetching round triggered!");
      try {
        console.log("Starting fetchRoundByDifficulty...");
        const token = localStorage.getItem("token");
        const decoded = jwtDecode(token);
        const userID = decoded.userId;
        console.log("User ID:", userID);
        console.log("Token:", token);
  
        // Fetch the difficulty first
        const difficultyResponse = await axios.get(
          "http://localhost:5000/api/performance/students/get-difficulty",
          {
            params: { userID, token }
          }
        );
  
        const difficulty = difficultyResponse.data.difficulty;
        console.log("Fetched Difficulty:", difficulty);
  
        // Fetch the round based on the chosen difficulty above
        const roundResponse = await axios.get(
          "http://localhost:5000/api/round/select-by-difficulty",
          {
            params: { difficulty },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
  
        const round = roundResponse.data;
        console.log("roundID: ", round.roundid, "QBankID: ", round.qbankid);
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
      const fetchQuestion = async () => {
        try {
          console.log("Fetching questions with qbID:", qBankID, " Index:", questionIndex);
          const token = localStorage.getItem("token"); // Retrieve token again
          const response = await axios.get(
            "http://localhost:5000/api/round/get-question",
            {
              params: { qBankID, questionIndex, token }
            }
          );
  
          const questionData = response.data;
  
          if (!questionData) {
            console.log("No more questions available. Ending round...");
            handleRoundComplete();
            return;
          } else {
            setQuestion(questionData);
            console.log("Fetched Question:", questionData);
          }
  
          console.log("Fetched Question:", question);
  
          let parsedAnswers = [];
          try {
              // If answeroptions is a string, parse it. Otherwise, use it directly
              const answerOptionsData = typeof questionData.answeroptions === "string" 
                  ? JSON.parse(questionData.answeroptions) 
                  : questionData.answeroptions;
          
              parsedAnswers = answerOptionsData.map((option) => option.option);
              console.log("Parsed Answers:", parsedAnswers);
          } catch (e) {
            return (<Alerter message={"failed to parse Answers" + e} type='error'></Alerter>)
          }
          
  
          setCurrentQuestion({
            questionID: questionData.questionid,
            context: questionData.questioncontext,
            text: questionData.questiontext,
          });
          setAnswers(parsedAnswers);
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

    console.log("Round Stats:", roundStats);

    try {
        // ✅ SINGLE REQUEST to process metrics
        const response = await axios.post(
            "http://localhost:5000/api/metric/process-metrics",
            roundStats,  // Send the stats directly in the request body
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        console.log("✅ Metrics Processed Successfully:", response.data);

        // Update achievements progress for roundsPlayed
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
    console.log(`Updating achievement progress for ${metric} by ${value} for ${userID}`);
    try {
      await axios.post(
        "http://localhost:5000/api/achievement/update-progress",
        {
          studentId: userID,
          metric,
          value,
        },
        {
          params: { token }
        }
      );
      console.log(`Updated achievement progress for ${metric} by ${value}`);
    } catch (error) {
      console.error("Error updating achievement progress:", error);
    }
  };

  const updateStreakProgress = async (studentId) => {
    console.log("Updating streak progress...");
    try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
            "http://localhost:5000/api/student/update-streak",
            { studentId },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        console.log("Updated Streak:", response.data);
    } catch (error) {
        setAlert({ message: "Error updating Streak: " + error.message, type: "error" });
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

    const endTime = Date.now();
    const answerTime = (endTime - startTime) / 1000; // Calculate time in seconds
    console.log(`Answer submitted at: ${endTime}`);
    console.log(`Time taken to answer: ${answerTime}s`);

    setTotalAnswerTime((prev) => {
      const updatedTime = prev + answerTime;
      console.log(`Updated total answer time: ${updatedTime}s`);
      return updatedTime;
    });

    // Proceed with answer validation
    console.log(
      "Selected Answer:",
      selectedAnswer,
      "QuestionID:",
      currentQuestion.questionID
    );

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

      console.log("Response from validate-answer:", response.data);

      const isCorrect = response.data;

      console.log("Is Correct:", isCorrect);

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
  }, [timer, isAnswered, disableTimer]);

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

  useEffect(() => {
    if (currentQuestion) {
      console.log("Resetting state for new question...");
      setTimer(30); // Reset to 30 seconds
      setHasTimerExpired(false);
      setIsAnswered(false);
      setShowCorrectOverlay(false);
      setShowIncorrectOverlay(false);

      // Start tracking answer time
      const questionStartTime = Date.now();
      setStartTime(questionStartTime);
      console.log(`Start time for question recorded: ${questionStartTime}`);
    }
  }, [currentQuestion]);

  //clear alert after 5 seconds
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);
  

return (
    <div className="round-page">
        {alert && <Alerter message={alert.message} type={alert.type} />}
        
        {question ? (
            <QuestionRenderer question={question} onAnswer={handleAnswerAndAdvance} timer={timer} />
        ) : (
            <LoadingSpinner />
        )}
    </div>
  );
};

export default RoundPage;
