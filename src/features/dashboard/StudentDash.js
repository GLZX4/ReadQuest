import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StreakTracker from "../progress/streakTracker";
import Achievements from "../progress/Achievements";
import DashboardLayout from "../dashboard/DashboardLayout";
import "../../styles/dashboard.css";
import "../../styles/dashboard/studentDashboard.css";
import cardSwipeSound from "../../assets/audio/card-swipe.wav";
import { jwtDecode } from 'jwt-decode';

const StudentDash = () => {
  const [studentId, setStudentId] = useState(0);
  const [expandedCard, setExpandedCard] = useState(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const userID = decoded.userId;
      setStudentId(userID);
    } catch (error) {
      console.error("Error fetching student ID", error);
    }
  }, []);

  const toggleExpand = (cardId) => {
    if (expandedCard === cardId) {
      setExpandedCard(null); 
    } else {
      setExpandedCard(cardId);
    }
  };

  const playHoverSound = () => {
    const audio = new Audio(cardSwipeSound); 
    audio.volume = 0.6;
    audio.play().catch((error) => console.error("Error playing audio:", error));
  };

  return (
    <DashboardLayout role="Student">
      <div className="dashboard-card-scroller">
        
        <div className={`dashboard-card streakCard ${expandedCard === "streak" ? "expanded" : ""}`}
            onClick={() => expandedCard ? null : toggleExpand("streak")}
            onMouseEnter={playHoverSound}
        >
          <span className="noselect"><b>Streak Tracker</b></span>
          <AnimatePresence>
            {expandedCard === "streak" && (
              <motion.div
                className="streakCard-expandedContent"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <StreakTracker studentId={studentId} />
                <button className="close-btn" onClick={(e) => {
                    e.stopPropagation(); 
                    toggleExpand("streak");
                }}>✖ Close</button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        <div className={`dashboard-card continueCard ${expandedCard === "continue" ? "expanded" : ""}`}
            onClick={() => expandedCard ? null : toggleExpand("continue")}
            onMouseEnter={playHoverSound}
        >
          <span className="noselect"><b>Continue To Play</b></span>
          <AnimatePresence>
            {expandedCard === "continue" && (
              <motion.div
                className="streakCard-expandedContent"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <button  className="roundBtn continueBtn" 
                onClick={() => window.location.href = '#/round'}>Continue...</button>
                <button className="close-btn" onClick={(e) => {
                    e.stopPropagation(); 
                    toggleExpand("continue");
                }}>✖ Close</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className={`dashboard-card newRoundCard ${expandedCard === "newRound" ? "expanded" : ""}`}
            onClick={() => expandedCard ? null : toggleExpand("newRound")}
            onMouseEnter={playHoverSound}
        >
          <span className="noselect"><b>Play New Round</b></span>
          <AnimatePresence>
            {expandedCard === "newRound" && (
              <motion.div
                className="streakCard-expandedContent"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <button className="roundBtn newRound" onClick={() => window.location.href = '#/round'}>New Round...</button>
                <button className="close-btn" onClick={(e) => {
                    e.stopPropagation(); 
                    toggleExpand("newRound");
                }}>✖ Close</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className={`dashboard-card achievementCard ${expandedCard === "achievements" ? "expanded" : ""}`}
            onClick={() => expandedCard ? null : toggleExpand("achievements")}
            onMouseEnter={playHoverSound}
        >
          <span className="noselect"><b>Achievements</b></span>
          <AnimatePresence>
            {expandedCard === "achievements" && (
              <motion.div
                className="streakCard-expandedContent"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Achievements studentId={studentId} />
                <button className="close-btn" onClick={(e) => {
                    e.stopPropagation(); 
                    toggleExpand("achievements");
                }}>✖ Close</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDash;
