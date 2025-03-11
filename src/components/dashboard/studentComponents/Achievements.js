import React, { useState, useEffect } from "react";
import axios from "axios";
import Alerter from "../../common/alerter";
import LoadingSpinner from "../../common/LoadingSpinner";
import achievementIcon from "../../../assets/images/achievements/Play-10-Rounds.svg";
import "../../../styles/achievements.css";

function Achievements({ studentId }) {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchAchievements = async () => {
      if (!studentId) return;

      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          "http://localhost:5000/api/achievement/fetch-achievements", 
          {
            params: { studentId },
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        setAchievements(response.data);
        console.log("Updated Achievements State:", response.data);
      } catch (error) {
        setAlert({ message: "Error fetching achievements: " + error.message, type: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [studentId]);


  // Auto-clear alert after 5 seconds
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  if (loading) return (
    <div className="achievements-container">
      <LoadingSpinner />
    </div>
    );

  return (
    <div className="achievements-container">
      {alert && <Alerter message={alert.message} type={alert.type} />}
      {achievements.map((achievement) => (
        <div 
          key={achievement.achievementId} 
          className={`achievement-item ${achievement.isUnlocked ? 'unlocked' : 'locked'}`}
        >
          <img src={achievementIcon} className="achievement-icon" alt="Achievement Icon" />
          <span>{achievement.type}</span>
          <p>Status: <b>{achievement.isUnlocked ? "Unlocked" : "Locked"}</b></p>
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${achievement.progressPercentage}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default Achievements;
