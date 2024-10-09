import React from "react";
import "../../styles/auxillary/loadingSpinner.css";

function LoadingSpinner() {
  return (
    <div className="loading-spinner">
        <span class="loader"></span>
        <span className="loader-loading">Loading...</span>
    </div>
  );
}

export default LoadingSpinner;