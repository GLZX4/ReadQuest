import React, { useState } from "react";
import axiosInstance from "../services/axiosInstance";

function TutorCodeGenerator({ schools }) {
  const [selectedSchoolID, setSelectedSchoolID] = useState("");
  const [recentCode, setRecentCode] = useState("");

  const handleSchoolSelect = (event) => setSelectedSchoolID(event.target.value);

  const codeGeneration = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length: 10 }, () =>
      characters.charAt(Math.floor(Math.random() * characters.length))
    ).join("");
  };

  const getExpiryDate = (startDateTime) => {
    const expiryDate = new Date(startDateTime);
    expiryDate.setDate(expiryDate.getDate() + 7);
    return expiryDate;
  };

  const codeSubmission = async () => {
    if (!selectedSchoolID) {
      console.error("Please select a school to generate a code.");
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
      console.log("schoolID:", selectedSchoolID);
      await axiosInstance.post("/api/admin/tutorAccountCode", { data });
      console.log("Code Submitted Successfully");
    } catch (error) {
      console.error("Code Submission Failed", error);
    }
  };

  return (
    <div className="code-generation">
      <h2>Tutor Account Code Generation</h2>
      <span className="code-generated">{recentCode}</span>
      <label htmlFor="school-select">Select School:</label>
      <select
        id="school-select"
        value={selectedSchoolID}
        onChange={handleSchoolSelect}
      >
        <option value="" disabled>
          Select a School
        </option>
        {schools.map((school) => (
          <option key={school.schoolid} value={school.schoolid}>
            {school.schoolname || "Unnamed School"}
          </option>
        ))}
      </select>

      <button className="code-generate-btn" onClick={codeSubmission}>
        Generate Code
      </button>
    </div>
  );
}

export default TutorCodeGenerator;
