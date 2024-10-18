import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminDash() {
  const [schools, setSchools] = useState([]); // State to store schools data
  const [selectedSchoolID, setSelectedSchoolID] = useState('');
  const [recentCode, setRecentCode] = useState('');

  // UseEffect to fetch schools on component mount
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/schoolsFetch');
        setSchools(response.data); // Assuming response.data is an array of schools
      } catch (error) {
        console.error('Error fetching schools:', error);
      }
    };

    fetchSchools();
  }, []); 

  
  const handleSchoolSelect = (event) => {
    setSelectedSchoolID(event.target.value);
  };

  
  const codeSubmission = async () => {
    if (!selectedSchoolID) {
      console.error("Please select a school to generate a code.");
      return;
    }

    const code = codeGeneration();
    const createdAt = new Date().toISOString(); // Convert to ISO string to avoid cyclic reference
    const expiryDate = getExpiryDate(new Date()).toISOString(); // Convert to ISO string
    const used = false;

    setRecentCode(code);

    const data = {
      verificationCode: code,
      schoolID: selectedSchoolID,
      expirationAt: expiryDate,
      used: used,
      createdAt: createdAt,
    };

    try {
      await axios.post('http://localhost:5000/api/admin/tutorAccountCode', data);
      console.log("Code Submitted Successfully");
    } catch (error) {
      console.error(error.response?.data?.message || 'Code Submission Failed');
    }
  };

  // Date and Code Generation Utility Functions
  const getExpiryDate = (startDateTime) => {
    const expiryDate = new Date(startDateTime);
    expiryDate.setDate(expiryDate.getDate() + 7);
    return expiryDate;
  };

  const codeGeneration = () => {
    let code = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < 10) {
      code += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter++;
    }
    return code;
  };

  return (
    <div className='dashboard-container'>
      <span className='dashboard-name'>Admin</span>
      <div className="dashboard-structure">
        <div className="dashboard-row">
          <div className="dashboard-item">
            <h2>Tutor Account Code Generation</h2>
            <span className='code-generated'>{recentCode}</span>
            {/* School selection dropdown */}
            <label htmlFor="school-select">Select School:</label>
            <select
              id="school-select"
              value={selectedSchoolID}
              onChange={handleSchoolSelect}
            >
              <option value="" disabled>Select a School</option>
              {schools.map((school) => (
                <option key={school.schoolID} value={school.schoolID}>
                  {school.schoolName}
                </option>
              ))}
            </select>

            {/* Button to generate code */}
            <button className='code-generate-btn' onClick={codeSubmission}>
              Generate Code
            </button>
          </div>
          <div className="dashboard-item"></div>
          <div className="dashboard-item"></div>
        </div>

        <div className="dashboard-row">
          <div className="dashboard-item">
            <h2>System Status</h2>
            <span>All systems operational</span>
          </div>
          <div className="dashboard-item"></div>
          <div className="dashboard-item"></div>
        </div>

        {/* Additional dashboard items can be added here */}
      </div>
    </div>
  );
}

export default AdminDash;
