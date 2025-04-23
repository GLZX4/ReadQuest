import React, { useEffect, useState } from "react";
import axios from "axios";
import Alerter from "../../common/alerter";
import "../../../styles/streakTracker.css";

const StreakTracker = ({ studentId }) => {
    const [streak, setStreak] = useState({ current: 0, best: 0 });
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        if (!studentId) return;
    
        const fetchStreak = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await axios.get("http://localhost:5000/api/student/get-streak", {
                    params: { studentId },
                    headers: { Authorization: `Bearer ${token}` }
                });
    
                setStreak(response.data);
                localStorage.setItem(`streak-${studentId}`, JSON.stringify(response.data));
                console.log("✅ Fetched and stored fresh streak data.");
            } catch (error) {
                setAlert({ message: "Error fetching streak: " + error.message, type: "error" });
            }
        };
    
        fetchStreak();
    }, [studentId]);
    

    useEffect(() => {
        if (alert) {
            const timer = setTimeout(() => setAlert(null), 15000);
            return () => clearTimeout(timer);
        }
    }, [alert]);

    return (
        <div className="streak-container">
            {alert && <Alerter message={alert.message} type={alert.type} />}

            <p>Current Streak: <span className="streak-count">{streak.current} Days</span></p>
            <p>Best Streak: <span className="streak-best">{streak.best} Days</span></p>

            <div className="streak-bar-container">
                <span>Progress to Streak Achievement!</span>
                <div className="streak-bar">
                    <div className="streak-progress" 
                        style={{ width: `${streak.best > 0 ? (streak.current / streak.best) * 100 : 0}%` }}>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StreakTracker;
