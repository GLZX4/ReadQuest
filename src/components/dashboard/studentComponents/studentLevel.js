import React from "react";
import "../../../styles/dashboard/studentLevel.css";

function StudentLevel({ level, xp }) {
    const xpForNextLevel = (level) => {
        return Math.floor(100 + level * 20);
    };

    const currentXP = xp;
    const xpNeeded = xpForNextLevel(level);
    const xpPercent = Math.min((currentXP / xpNeeded) * 100, 100);

    return (
        <div className="level-container">
            <div className="level-header">
                <span className="level-title">Level {level}</span>
                <span className="xp-count">{currentXP} / {xpNeeded} XP</span>
            </div>
            <div className="progress-bar-xp">
                <div
                    className="progress-fill-xp"
                    style={{ width: `${xpPercent}%` }}
                ></div>
            </div>
        </div>
    );
}

export default StudentLevel;
