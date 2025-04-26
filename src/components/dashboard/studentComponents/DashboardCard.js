import React from "react";
import {motion, AnimatePresence} from "framer-motion";
import "../../../styles/dashboard/studentDashboard.css";

function DashboardCard({ 
    title, 
    children, 
    cardId, 
    expandedCard, 
    toggleExpand, 
    playHoverSound 
}) {
    const isExpanded = expandedCard === cardId;

    return (
        <div
            className={`dashboard-card ${cardId} ${isExpanded ? "expanded" : ""}`}
            onClick={() => expandedCard ? null : toggleExpand(cardId)}
            onMouseEnter={playHoverSound}
        >
            <span className="noselect"><b>{title}</b></span>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        className="streakCard-expandedContent"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        {children}
                        <button className="close-btn" onClick={(e) => {
                            e.stopPropagation();
                            toggleExpand(cardId);
                        }}>✖ Close</button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default DashboardCard;
