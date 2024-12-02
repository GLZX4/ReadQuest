import React, { useState } from "react";
import "../styles/studentContainer.css";

function StudentContainer({ student }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => setIsExpanded(!isExpanded);

    return (
        <div className="studentContainer">
            <div className="studentSummary noselect" onClick={toggleExpand}>
                <span className=" studentItem studentName">{student.name}</span>

                <span className="toggleDetails">
                    {isExpanded ? "Show Less ▲" : "Show More ▼"}
                </span>
            </div>

            {isExpanded ? (
                <div className="studentDetails">
                    {/* Add detailed information here */}
                    <span className="studentDetail"><b>Last Active:</b> {student.LastActive || "Unknown"}</span>
                    <span className="studentItem">
                    <b>Rounds Completed:</b> {student.totalrounds}
                    </span>
                    <span className="studentItem">
                        <b>Average Score:</b> {student.averagescore ? student.averagescore.toFixed(2) : "N/A"}
                    </span>
                    <span className="studentItem">
                        <b>Accuracy Rate:</b> {student.accuracyrate ? `${student.accuracyrate}%` : "N/A"}
                    </span>
                    <span className="studentItem">
                        <b>Completion Rate: </b> {student.completionrate ? `${student.completionrate}%` : "N/A"}
                    </span>
                </div>
            ) : null}
        </div>
    );
}

export default StudentContainer;
