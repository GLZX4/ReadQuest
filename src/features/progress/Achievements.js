// src/features/progress/Achievements.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/achievements.css"

function Achievements({ studentId }) {
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        // Assuming the endpoint is `/api/students/:studentId/achievements`
        const response = await axios.get(`/api/students/${studentId}/achievements`);
        setAchievements(response.data);
      } catch (error) {
        console.error("Error fetching achievements:", error);
      }
    };

    if (studentId) {
      fetchAchievements();
    }
  }, [studentId]);

  return (
    <div className="achievements-container">
      {achievements.length > 0 ? (
        achievements.map((achievement, index) => (
          <div key={index} className={`achievement ${achievement.isUnlocked ? '' : 'locked'}`}>
            <div className="achievement-icon">
              <img
                src={achievement.icon}
                alt={achievement.name}
                style={{ filter: achievement.isUnlocked ? 'none' : 'grayscale(100%)' }}
              />
            </div>
            <span className="achievement-name">{achievement.name}</span>
          </div>
        ))
      ) : (
        <p>No achievements yet...</p>
      )}
    </div>
  );
}

export default Achievements;
