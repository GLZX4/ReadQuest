// src/components/dashboard/AdminDash.js
import React from 'react';
import "../../styles/dashboard.css";

function AdminDash() {
  
  
  
  return(
    <div className='dashboard-container'>
      <span className='dashboard-name'>Admin</span>
      <div className="dashboard-structure">
        <div className="dashboard-row">
          <div className="dashboard-item weekProgress">
          </div>
            <div className="dashboard-item continueBtn">
            </div>
            <div className="dashboard-item continueBtn">
            </div>
        </div>
        <div className="dashboard-row">
          <div className="dashboard-item weekProgress">
          </div>
            <div className="dashboard-item continueBtn">
            </div>
            <div className="dashboard-item continueBtn">
            </div>
        </div>
      </div>
    </div>
  ) 
}

export default AdminDash;