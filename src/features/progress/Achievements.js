import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/achievements.css";
import achievementIcon from "../../assets/images/achievements/Play-10-Rounds.svg";

function Achievements({ studentId }) {
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/student/fetch-achievements",
          { params: { studentId } }
        );
        setAchievements(response.data);
        console.log("Achievements", response.data);
      } catch (error) {
        console.error("Error fetching achievements", error);
      }
    };
    fetchAchievements();
  }, [studentId]);

  return (
    <div className="achievements-container">
      {achievements.length > 0 ? (
        achievements.map((achievement) => (
          <div key={achievement.achievementID} className="achievement-item noselect">
            <img
              src={achievementIcon}
              className="achievement-icon"
              alt="Achievement Icon"
            />
            <h3>{achievement.title}</h3>
            <p>{achievement.description}</p>
            <p>Status: {achievement.status}</p>
            {achievement.progress && (
              <div className="progress-bar-container">
                <p><b>Progress: </b></p>
                <div
                  className="progress-bar"
                  style={{
                    width: `${achievement.progressPercentage}%`,
                  }}
                >
                  <p>{achievement.progressPercentage}%</p>
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No achievements yet...</p>
      )}
    </div>
  );
}

export default Achievements;
