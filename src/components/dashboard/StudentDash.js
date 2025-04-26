import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StreakTracker from "./studentComponents/streakTracker";
import Achievements from "./studentComponents/Achievements";
import DashboardLayout from "../dashboard/DashboardLayout";
import DashboardCard from "./studentComponents/DashboardCard";
import "../../styles/dashboard.css";
import "../../styles/dashboard/studentDashboard.css";
import cardSwipeSound from "../../assets/audio/card-swipe.wav";
import { jwtDecode } from 'jwt-decode';

const StudentDash = () => {
  const [studentId, setStudentId] = useState(0);
  const [expandedCard, setExpandedCard] = useState(null);
  const [level, setLevel] = useState(null);


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
        
        <DashboardCard 
          title="Streak Tracker" 
          cardId="streakCard" 
          expandedCard={expandedCard} 
          toggleExpand={toggleExpand} 
          playHoverSound={playHoverSound}
        >
          <StreakTracker studentId={studentId} />
        </DashboardCard>

        <DashboardCard 
          title="Continue To Play" 
          cardId="continueCard" 
          expandedCard={expandedCard} 
          toggleExpand={toggleExpand} 
          playHoverSound={playHoverSound}
        >
          <button className="roundBtn continueBtn" onClick={() => window.location.href = '#/round'}>
            Continue...
          </button>
        </DashboardCard>

        <DashboardCard 
          title="Play New Round" 
          cardId="newRoundCard" 
          expandedCard={expandedCard} 
          toggleExpand={toggleExpand} 
          playHoverSound={playHoverSound}
        >
          <button className="roundBtn newRound" onClick={() => window.location.href = '#/round'}>
            New Round...
          </button>
        </DashboardCard>

        <DashboardCard 
          title="Achievements" 
          cardId="achievementCard" 
          expandedCard={expandedCard} 
          toggleExpand={toggleExpand} 
          playHoverSound={playHoverSound}
        >
          <Achievements studentId={studentId} />
        </DashboardCard>

      </div>
    </DashboardLayout>
  );
};

export default StudentDash;
