import React, { useEffect, useState } from 'react';
import DashboardLayout from '../dashboard/DashboardLayout';
import StudentContainer from '../../components/StudentContainer';

import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

function TutorDash() {
  const [userID, setUserID] = useState(0);
  const [studentList, setStudentList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const decoded = jwtDecode(token);
        const userID = decoded.userId;
        setUserID(userID);

        const response = await axios.get('http://localhost:5000/api/tutor/studentsList', {
          params: { tutorID: userID },
        });

        setStudentList(response.data);
      } catch (error) {
        console.error('Error fetching student list:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <DashboardLayout role="Tutor">
      <div className="dashboard-row">

        <div className="dashboard-item studentList">
        <h2>List of Your Students</h2>
        {studentList.map((student, index) => (
            <StudentContainer key={index} student={student} />
        ))}
      </div>

      </div>
    </DashboardLayout>
  );
}

export default TutorDash;