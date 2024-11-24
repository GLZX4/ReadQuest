import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddSchool from '../../components/AddSchool';
import DashboardLayout from '../dashboard/DashboardLayout';
import '../../styles/admindash.css';

function AdminDash() {
  const [schools, setSchools] = useState([]);
  const [selectedSchoolID, setSelectedSchoolID] = useState('');
  const [recentCode, setRecentCode] = useState('');
  const [isAddSchoolVisible, setIsAddSchoolVisible] = useState(false);
  const [adminData, setAdminData] = useState({
    totalUsers: 0,
    activeUsers: 0,
    systemStatus: '',
  });

  useEffect(() => {
    const fetchSchools = async () => {
      try {
          const response = await axios.get('http://localhost:5000/api/admin/schoolsFetch');
          console.log('Fetched Schools in Frontend:', response.data); // Debugging log
          setSchools(response.data); // Directly set the response without filtering
      } catch (error) {
          console.error('Error fetching schools:', error);
      }
  };
  

    const fetchAdminData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/fetchAdminData');
        setAdminData(response.data);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      }
    };

    fetchSchools();
    fetchAdminData();
  }, []);

  const handleSchoolSelect = (event) => setSelectedSchoolID(event.target.value);

  const codeSubmission = async () => {
    if (!selectedSchoolID) {
      console.error('Please select a school to generate a code.');
      return;
    }

    const code = codeGeneration();
    setRecentCode(code);

    const createdAt = new Date().toISOString();
    const expiryDate = getExpiryDate(new Date()).toISOString();

    const data = {
      verificationCode: code,
      schoolID: selectedSchoolID,
      expirationAt: expiryDate,
      used: false,
      createdAt,
    };

    try {
      await axios.post('http://localhost:5000/api/admin/tutorAccountCode', data);
      console.log('Code Submitted Successfully');
    } catch (error) {
      console.error('Code Submission Failed', error);
    }
  };

  const codeGeneration = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length: 10 }, () =>
      characters.charAt(Math.floor(Math.random() * characters.length))
    ).join('');
  };

  const getExpiryDate = (startDateTime) => {
    const expiryDate = new Date(startDateTime);
    expiryDate.setDate(expiryDate.getDate() + 7);
    return expiryDate;
  };

  const toggleAddSchoolVisibility = () =>
    setIsAddSchoolVisible((prevState) => !prevState);

  return (
    <DashboardLayout role="Admin">
      <div className="dashboard-row">
        <div className="dashboard-item code-generation">
          <h2>Tutor Account Code Generation</h2>
          <span className="code-generated">{recentCode}</span>
          <label htmlFor="school-select">Select School:</label>
          <select id="school-select" value={selectedSchoolID} onChange={handleSchoolSelect}>
            <option value="" disabled>
              Select a School
            </option>
            {schools.map((school) => (
              <option key={school.schoolID} value={school.schoolID}>
                {school.schoolname || 'Unnamed School'}
              </option>
            ))}
          </select>


          <button className="code-generate-btn" onClick={codeSubmission}>
            Generate Code
          </button>
        </div>
        <div className="dashboard-item new-school">
          <h2>Add a School</h2>
          <button className="toggle-school-form" onClick={toggleAddSchoolVisibility}>
            {isAddSchoolVisible ? 'Hide Form' : 'Show Form'}
          </button>
          {isAddSchoolVisible && <AddSchool />}
        </div>
      </div>
      <div className="dashboard-row">
        <div className="dashboard-item">
          <h2>System Status</h2>
          <span>{adminData.systemStatus}</span>
          <span>Users Logged In: {adminData.activeUsers}</span>
          <span>Total System Users: {adminData.totalUsers}</span>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdminDash;
