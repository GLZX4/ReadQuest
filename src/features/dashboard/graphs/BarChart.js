import React from "react";
import "../../../styles/charts/barChart.css";

function BarChart({ data }) {
  return (
    <div className="bar-chart-container">
      {data.map((item, index) => (
        <div key={index} className="bar-wrapper">
          <div
            style={{ height: `${item.value}px` }}
            className={`bar bar-${index + 1}`} // Add dynamic class name based on index
          />
          <span className="bar-label">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export default BarChart;
