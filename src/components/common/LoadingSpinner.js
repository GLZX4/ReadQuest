import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/auxillary/loadingSpinner.css";

function LoadingSpinner() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("Timeout reached. Redirecting to login...");
      navigate("/login"); 
    }, 20000); 

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="loading-spinner">
        <span className="loader"></span>
        <span className="loader-loading">Loading...</span>
    </div>
  );
}

export default LoadingSpinner;