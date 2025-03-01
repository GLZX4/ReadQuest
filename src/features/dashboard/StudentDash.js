import React, { useEffect, useState } from "react";
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
          <span><b>Streak Tracker</b></span>
          {expandedCard === "streak" && (
            <div className="streakCard-expandedContent ">
              <StreakTracker studentId={studentId} />
              <button className="close-btn" onClick={(e) => {
                  e.stopPropagation(); 
                  toggleExpand("streak");
              }}>✖ Close</button>
            </div>
          )}
        </div>

        <div className={`dashboard-card continueCard ${expandedCard === "continue" ? "expanded" : ""}`}
            onClick={() => expandedCard ? null : toggleExpand("continue")}
            onMouseEnter={playHoverSound}
        >
          <span><b>Continue To Play</b></span>
          {expandedCard === "continue" && (
            <div className="streakCard-expandedContent ">
              <button onClick={() => window.location.href = '#/round'}>Continue...</button>
              <button className="close-btn" onClick={(e) => {
                  e.stopPropagation(); 
                  toggleExpand("continue");
              }}>✖ Close</button>
            </div>
          )}
        </div>

        <div className={`dashboard-card newRoundCard ${expandedCard === "newRound" ? "expanded" : ""}`}
            onClick={() => expandedCard ? null : toggleExpand("newRound")}
            onMouseEnter={playHoverSound}
        >
          <span><b>Play New Round</b></span>
          {expandedCard === "newRound" && (
            <div className="streakCard-expandedContent ">
              <button className="newRound" onClick={() => window.location.href = '#/round'}>New Round...</button>
              <button className="close-btn" onClick={(e) => {
                  e.stopPropagation(); 
                  toggleExpand("newRound");
              }}>✖ Close</button>
            </div>
          )}
        </div>

        <div className={`dashboard-card achievementCard ${expandedCard === "achievements" ? "expanded" : ""}`}
            onClick={() => expandedCard ? null : toggleExpand("achievements")}
            onMouseEnter={playHoverSound}
        >
          <span><b>Achievements</b></span>
          {expandedCard === "achievements" && (
            <div className="streakCard-expandedContent">
              <Achievements studentId={studentId} />
              <button className="close-btn" onClick={(e) => {
                  e.stopPropagation(); 
                  toggleExpand("achievements");
              }}>✖ Close</button>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default StudentDash;
