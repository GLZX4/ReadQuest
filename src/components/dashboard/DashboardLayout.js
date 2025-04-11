import React, {useState, useEffect} from "react";
import '../../styles/dashboard.css';
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import StudentLevel from "../dashboard/studentComponents/studentLevel";

function DashboardLayout({ role, children }) {

  const [level, setLevel] = useState(null);
  const [xp, setXP] = useState(null);

  useEffect(() => {
    const fetchLevel = async () => {
      if (role.toLowerCase() !== "student") return;
  
      try {
        const token = localStorage.getItem("token");
        const decoded = jwtDecode(token);
        const userID = decoded.userId;
  
        const response = await axios.get("http://localhost:5000/api/student/get-level", {
          params: { userID },
          headers: { Authorization: `Bearer ${token}` }
        });
  
        setLevel(response.data.level);
        setXP(response.data.xp);
      } catch (error) {
        console.error("Error fetching level:", error);
      }
    };
  
    fetchLevel();
  }, [role]);
  

  return (
    <div className="dashboard-container">
      <div className="dashboard-title-structure">
        <span className="dashboard-name">{role}</span>

        {role.toLowerCase() === "student" && (
          <StudentLevel level={level} xp={xp} />
        )}
      </div>
      <div className="dashboard-structure">{children}</div>
    </div>
  )
}

export default DashboardLayout;