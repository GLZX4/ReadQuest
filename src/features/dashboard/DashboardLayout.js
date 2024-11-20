import React from "react";
import '../../styles/dashboard.css';

const DashboardLayout = ({ role, children }) => {
    return (
        <div className="dashboard-container">
        <span className="dashboard-name">{role}</span>
        <div className="dashboard-structure">{children}</div>
      </div>
    )
};

export default DashboardLayout;