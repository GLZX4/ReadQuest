import React, { useEffect, useState } from 'react';
import DashboardLayout from '../dashboard/DashboardLayout';
import StudentContainer from '../../components/StudentContainer';
import AddQuestionSet from '../../components/AddQuestionSet';
import '../../styles/tutorDashboard.css';

import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

function TutorDash() {
  const [userID, setUserID] = useState(0);
  const [studentList, setStudentList] = useState([]);
  const [tutorData, setTutorData] = useState({});
  const [showAddQuestionSet, setShowAddQuestionSet] = useState(false); // State to toggle the modal

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const decoded = jwtDecode(token);
        console.log('token:', token);
        const tutorID = decoded.userId;
        setUserID(tutorID);

        // Send GET request with query parameters and Authorization header
        const response = await axios.get("http://localhost:5000/api/tutor/studentsList", {
          params: { tutorID },
          headers: { Authorization: `Bearer ${token}` },
        });

        setStudentList(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          console.error('Token expired. Please log in again.');
          localStorage.removeItem('token');
          alert('Your session has expired. Please log in again.');
          window.location.href = '#/login';
        } else {
          console.error('Error fetching students data:', error.response?.data || error.message);
          throw error;
        }
      }
    };

    const fetchTutorData = async () => {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const userid = decoded.userId;

      try {
          const token = localStorage.getItem('token');
          const response = await axios.get('http://localhost:5000/api/tutor/fetch-Tutor-Data', {
            params: { userid },
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log('Fetched Tutor Data:', response.data);
          setTutorData(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          console.error('Token expired. Please log in again.');
          localStorage.removeItem('token');
          alert('Your session has expired. Please log in again.');
          window.location.href = '#/login';
        } else {
          console.error('Error fetching tutor data:', error.response?.data || error.message);
          throw error;
        }
      }
  };
    fetchData();
    fetchTutorData();
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
        <div className="dashboard-item schoolCode">
          <h2>Your School Code:</h2>
          <div className="CodeContainer">
            <span className="schoolIDDisplay">
              {tutorData.schoolCode || "Not Assigned"}
            </span>
          </div>
          {tutorData.schoolCode && (
            <button
              className="copy-btn"
              onClick={() => {
                navigator.clipboard.writeText(tutorData.schoolCode);
                alert("School Code copied to clipboard!");
              }}
            >
              Copy Code
            </button>
          )}
        </div>
      </div>

      <div className='dashboard-row'>
      <div className="dashboard-item addQuestions">
          <h2>Add Questions</h2>
          <button
            className="addQuestions-Btn"
            onClick={() => setShowAddQuestionSet(true)} // Show the modal
          >
            Add Question Set
          </button>
        </div>
      </div>

      {/* Conditional Rendering for AddQuestionSet */}
      {showAddQuestionSet && (
        <AddQuestionSet onClose={() => setShowAddQuestionSet(false)} />
      )}

    </DashboardLayout>
  );
}

export default TutorDash;