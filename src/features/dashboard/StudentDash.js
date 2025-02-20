import React, { useEffect, useState } from "react";
import axios from "axios";
import StreakTracker from "../progress/streakTracker";
import RoundScroller from "./graphs/RoundScroller";
import Achievements from "../progress/Achievements";
import DashboardLayout from "../dashboard/DashboardLayout";
import getOrdinalSuffix from "../../services/OrdinalSuffix";
import "../../styles/dashboard.css";
import "../../styles/studentDashboard.css";
import { jwtDecode } from 'jwt-decode';

const StudentDash = () => {
  const [studentId, setStudentId] = useState(0);
  const [barChartData, setBarChartData] = useState([]);


  
  // Fetch student ID from JWT
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

  const navigateToRound = () => {
    window.location.href = '#/round';
  };

  return (
    <DashboardLayout role="Student">
      <div className="dashboard-row">
        <div className="dashboard-item streakTracker">
          <span>
            <b>Streak Tracker 🔥</b>
          </span>
          <StreakTracker studentId={studentId}></StreakTracker>
        </div>

        <div className="dashboard-item continueBtn">
          <span>
            <b>Continue To Play</b>
          </span>
          <button onClick={navigateToRound}>Continue...</button>
        </div>

        <div className="dashboard-item continueBtn">
          <span>
            <b>Play New Round</b>
          </span>
          <button className="newRound" onClick={navigateToRound}>
            New Round...
          </button>
        </div>
        
      </div>

      <div className="dashboard-row">
        <div className="dashboard-item barGraph">
          <span>
            <b>Spare</b>
          </span>
          
        </div>
        <div className="dashboard-item achievements">
          <span>
            <b>Achievements</b>
          </span>
          <Achievements studentId={studentId} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDash;
