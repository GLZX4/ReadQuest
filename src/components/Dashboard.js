// Dashboard.js 

import React, { useState, useEffect } from "react";
import axios from "axios";
import StudentDash from "../features/dashboard/StudentDash";
import TutorDash from "../features/dashboard/TutorDash";
import AdminDash from "../features/dashboard/AdminDash";
import "../styles/dashboard.css"; 

const Dashboard = ({ userRole }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
              let response;
              switch (userRole) {
                case "student":
                  response = await axios.get("http://localhost:5000/api/student");
                  break;
                case "tutor":
                  response = await axios.get("http://localhost:5000/api/tutor");
                  break;
                case "admin":
                  response = await axios.get("http://localhost:5000/api/admin");
                  break;
                default:
                  throw new Error("Invalid user role");
              }
              setData(response.data);
              setLoading(false);
            } catch (error) {
              setError(error.response?.data?.message || "An error occurred");
              setLoading(false);
            }
          };
          
        fetchData();
    }, [userRole]);
    

    if (loading) return <div className="dashboard-container">Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="dashboard-container">
            {userRole === "student" && <StudentDash data={data} />}
            {userRole === "tutor" && <TutorDash data={data} />}
            {userRole === "admin" && <AdminDash data={data} />}
        </div>
    );
};

export default Dashboard;
