import React, { useState, useEffect } from "react";
import axios from "axios";
import AddSchool from "../../components/AddSchool";
import DashboardLayout from "../dashboard/DashboardLayout";
import TutorCodeGenerator from "../../components/tutorCodeGeneration"
import SchoolsList from "../../components/SchoolsList";
import "../../styles/admindash.css";

function AdminDash() {
  const [schools, setSchools] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddSchoolVisible, setIsAddSchoolVisible] = useState(false);
  const [adminData, setAdminData] = useState({
    totalUsers: 0,
    activeUsers: 0,
    systemStatus: "",
  });

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/admin/schoolsFetch"
        );
        console.log("Fetched Schools in Frontend:", response.data);
        setSchools(response.data);
      } catch (error) {
        console.error("Error fetching schools:", error);
      }
    };

    const fetchAdminData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/admin/fetchAdminData"
        );
        setAdminData(response.data);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchSchools();
    fetchAdminData();
  }, []);

  const filteredSchools = schools.filter((school) =>
    school.schoolname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleAddSchoolVisibility = () =>
    setIsAddSchoolVisible((prevState) => !prevState);

  return (
    <DashboardLayout role="Admin">
      <div className="dashboard-row">
        
        <div className="dashboard-item">
        <TutorCodeGenerator schools={schools} />
        </div>

        <div className="dashboard-item new-school">
          <h2>Add a School</h2>
          <button
            className="toggle-school-form"
            onClick={toggleAddSchoolVisibility}
          >
            {isAddSchoolVisible ? "Hide Form" : "Show Form"}
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

        <div className="dashboard-item allschools">
          <h2>All Schools</h2>
          <input
          type="text"
          className="Schools-search-bar"
          placeholder="Search for a school..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {/* Pass Filtered Schools */}
        <SchoolsList schools={filteredSchools} />
        </div>

      </div>
    </DashboardLayout>
  );
}

export default AdminDash;
