import React, { useEffect, useState } from "react";
import axios from "axios";
import BarChart from "./graphs/BarChart"; // Fixed import with capitalized B

const StudentDash = () => {
  const [numOfRounds, setNumOfRounds] = useState(0);
  const [barChartData, setBarChartData] = React.useState([
    { label: "2024-09-28", value: 150 },
    { label: "2024-09-29", value: 250 },
    { label: "2024-09-30", value: 100 },
    { label: "2024-10-01", value: 200 },
    { label: "2024-10-02", value: 300 }
  ]);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/rounds/last-5-days');
        const data = response.data.map(item => ({
          label: new Date(item.day).toLocaleDateString(),
          value: item.completedRounds * 50, // This should give meaningful values
        }));
        console.log(data); // Check if the data has meaningful heights
        setBarChartData(data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
  
    fetchData();
  }, []);
  

  return (
    <>
      <span className="dashboard-studentName">John Doe</span>
      <div className="dashboard-structure">
        <div className="dashboard-row">
          <div className="dashboard-item weekProgress">You Have completed: 
            <div className="numOfRounds" data={numOfRounds}></div>
          </div>
          <div className="dashboard-item continueBtn">
            <button>Continue...</button>
          </div>
          
        </div>

        <div className="dashboard-row">
          <div className="dashboard-item barGraph">
            <span><b>Last Rounds in 5 Days</b></span>
            <BarChart data={barChartData} />
          </div>
          <div className="dashboard-item achievements">Latest Achievement</div>
        </div>
      </div>
    </>
  );
};

export default StudentDash;
