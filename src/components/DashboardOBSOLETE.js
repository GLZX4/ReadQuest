import React, { useState, useEffect } from "react";
import axios from "axios";
import StudentDash from "../features/dashboard/StudentDash";
import TutorDash from "../features/dashboard/TutorDash";
import AdminDash from "../features/dashboard/AdminDash";
import "../styles/dashboard.css"; 

const Dashboard = ({ userRole }) => {
  console.log("Dashboard component rendering, userRole:", userRole);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
      console.log("useEffect triggered, userRole:", userRole);
      const fetchData = async () => {
          try {
              console.log("Starting API fetch for role:", userRole);
              let response;
              switch (userRole) {
                  case "student":
                      console.log("Fetching student data...");
                      response = await axios.get("http://localhost:5000/api/student/fetchStudentData");
                      break;
                  case "tutor":
                      console.log("Fetching tutor data...");
                      response = await axios.get("http://localhost:5000/api/tutor/fetchTutorData");
                      break;
                  case "admin":
                      console.log("Fetching admin data...");
                      response = await axios.get("http://localhost:5000/api/admin/fetchAdminData");
                      break;
                  default:
                      throw new Error("Invalid user role");
              }
              console.log("API Response:", response.data);
              setData(response.data);
              setLoading(false);
          } catch (error) {
              console.error("Error fetching data:", error.message);
              console.error("Error details:", error.response?.data || error);
              setError(error.response?.data?.message || "An error occurred");
              setLoading(false);
          }
      };

      fetchData();
  }, [userRole]);

  console.log("Render State: loading =", loading, ", error =", error, ", data =", data);

  if (loading) {
      console.log("Still loading...");
      return (
          <div className="dashboard-container">
              <div className="loader"></div>
          </div>
      );
  }

  if (error) {
      console.log("Rendering error:", error);
      return <div>{error}</div>;
  }

  console.log("Rendering dashboard for user role:", userRole);

  return (
      <div className="dashboard-container">
          {userRole === "student" && <StudentDash data={data} />}
          {userRole === "tutor" && <TutorDash data={data} />}
          {userRole === "admin" && <AdminDash data={data} />}
      </div>
  );
};

export default Dashboard;
