import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/achievements.css";
import achievementIcon from "../../assets/images/achievements/Play-10-Rounds.svg";
import LoadingSpinner from "../round/LoadingSpinner";

function Achievements({ studentId }) {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchAchievements = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          "http://localhost:5000/api/student/fetch-achievements",
          { params: { studentId, token } }
        );
        setAchievements(response.data);
        console.log("Achievements", response.data);
      } catch (error) {
        console.error("Error fetching achievements", error);
      } finally {
        setLoading(false); // Set loading to false after fetch
      }
    };
    fetchAchievements();
  }, [studentId]);

  if (loading) {
    return <div className="achievements-container">Loading achievements...
      <LoadingSpinner/>
    </div>;
  }

  return (
    <div className="achievements-container">
      {achievements.length > 0 ? (
        achievements.map((achievement) => (
          <div
            key={achievement.studentachievementid} // Use a unique key
            className="achievement-item noselect"
          >
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
                <p>
                  <b>Progress: </b>
                </p>
                <div
                  className="progress-bar"
                  style={{
                    width: `${achievement.progressPercentage || 0}%`,
                  }}
                >
                  <p>{achievement.progressPercentage || 0}%</p>
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
