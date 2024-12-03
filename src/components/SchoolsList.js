import React, { useState } from "react";
import "../styles/schoolList.css";

function SchoolsList({ schools }) {
    
  return (
    <div className="schoolsList">

      {schools.map((school) => (
        <div className="schoolItem" key={school.schoolid}>
          <span className="schoolname">
            <b>School Name:</b> {school.schoolname || "Unnamed School"}
          </span>
          <span>
            <b>Address:</b> {school.address || "N/A"}
          </span>
          <span>
            <b>Contact Email:</b> {school.contactemail || "N/A"}
          </span>
          <span>
            <b>Contact Phone:</b> {school.contactphone || "N/A"}
          </span>
          <span>
            <b>School Code:</b> {school.schoolcode || "N/A"}
          </span>
        </div>
      ))}
    </div>
  );
}

export default SchoolsList;
