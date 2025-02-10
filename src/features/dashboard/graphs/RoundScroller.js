import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "../../../styles/charts/roundScroller.css";



function RoundScroller({ userID }) {
  const scrollRef = useRef(null);
  const [rounds, setRounds] = useState([]);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -100, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 100, behavior: "smooth" });
  };

  useEffect(() => {
    const fetchCompletedRounds = async () => {
      const token = localStorage.getItem("token");
      try {
        console.log("Fetching completed rounds for student ID:", userID);
        const roundResponse = await axios.get(
          "http://localhost:5000/api/student/completed-rounds",{
          params: { userID }, 
          headers: { Authorization: `Bearer ${token}` } 
        } 
        );
        setRounds(roundResponse.data);
        console.log("Rounds:", roundResponse.data); // Debugging log
      } catch (e) {
        console.error("Error fetching rounds:", e);
      }
    };

    if (userID) {
      fetchCompletedRounds();
    }
  }, [userID]);

  return (
    <div className="round-scroller-wrapper">
      <button className="scroll-btn" onClick={scrollLeft}>
        {"<"}
      </button>
      <div className="round-scroller" ref={scrollRef}>
        {rounds.map((round, index) => (
          <div key={index} className={`round round-${round.status}`}>
            {index + 1}
          </div>
        ))}
      </div>
      <button className="scroll-btn" onClick={scrollRight}>
        {">"}
      </button>
    </div>
  );
}

export default RoundScroller;
