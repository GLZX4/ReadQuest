import React from 'react';
import DashboardLayout from '../dashboard/DashboardLayout';

function TutorDash() {
  return (
    <DashboardLayout role="Tutor">
      <div className="dashboard-row">
        {/* Tutor-specific content here */}
        <div className="dashboard-item">
          <h2>Task Assignment</h2>
          {/* Add components or elements for task assignment */}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default TutorDash;
