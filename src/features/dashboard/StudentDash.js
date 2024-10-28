import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BarChart from "./graphs/BarChart";
import RoundScroller from "./graphs/RoundScroller";
import Achievements from "../progress/Achievements";
import "../../styles/dashboard.css";

const studentId = 1; // Assuming studentId is 1 for now

// Function to add ordinal suffixes to day numbers
const getOrdinalSuffix = (day) => {
  if (day > 3 && day < 21) return day + "th";
  switch (day % 10) {
    case 1:
      return day + "st";
    case 2:
      return day + "nd";
    case 3:
      return day + "rd";
    default:
      return day + "th";
  }
};

// Function to format date to "Month the daySuffix" format
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { month: "long" };
  const month = new Intl.DateTimeFormat("en-US", options).format(date);
  const day = date.getDate();
  return `${month} the ${getOrdinalSuffix(day)}`;
};

const StudentDash = () => {
  const [numOfRounds, setNumOfRounds] = useState([
    { roundNum: 1, completed: "complete" },
    { roundNum: 2, completed: "partial" },
    { roundNum: 3, completed: "complete" },
    { roundNum: 4, completed: "incomplete" },
    { roundNum: 5, completed: "incomplete" },
    { roundNum: 6, completed: "complete" },
    { roundNum: 7, completed: "complete" },
    { roundNum: 8, completed: "partial" },
  ]);

  const [barChartData, setBarChartData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Format initial data for the bar chart
    const formattedData = [
      { label: "2024-09-28", value: 150 },
      { label: "2024-09-29", value: 250 },
      { label: "2024-09-30", value: 100 },
      { label: "2024-10-01", value: 200 },
      { label: "2024-10-02", value: 300 },
    ].map((item) => ({
      label: formatDate(item.label),
      value: item.value,
    }));
    setBarChartData(formattedData);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/rounds/last-5-days");
        const data = response.data.map((item) => ({
          label: formatDate(item.day),
          value: item.completedRounds * 50, // This should give meaningful values
        }));
        setBarChartData(data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  const navigateToRound = () => {
    navigate("/round");
  };

  return (
    <div className="dashboard-container">
      <span className="dashboard-name">John Doe</span>
      <div className="dashboard-structure">
        <div className="dashboard-row">
          <div className="dashboard-item weekProgress">
            <span><b>Rounds Completed</b></span>
            <RoundScroller rounds={numOfRounds} />
          </div>
          <div className="dashboard-item continueBtn">
            <span><b>Continue To Play</b></span>
            <button onClick={navigateToRound}>Continue...</button>
          </div>
          <div className="dashboard-item continueBtn">
            <span><b>Play New Round</b></span>
            <button className="newRound" onClick={navigateToRound}>New Round...</button>
          </div>
        </div>

        <div className="dashboard-row">
          <div className="dashboard-item barGraph">
            <span><b>Last Rounds in 5 Days</b></span>
            <BarChart data={barChartData} />
          </div>
          <div className="dashboard-item achievements">
            <span><b>Achievements</b></span>
            <Achievements studentId={studentId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDash;
