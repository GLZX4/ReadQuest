import React from "react";
import "../../../styles/charts/roundScroller.css";

function RoundScroller({ rounds }) {
  const scrollRef = React.useRef(null);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -100, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 100, behavior: "smooth" });
  };

  return (
    <div className="round-scroller-wrapper">
      <button className="scroll-btn" onClick={scrollLeft}>{"<"}</button>
      <div className="round-scroller" ref={scrollRef}>
        {rounds.map((round, index) => (
          <div key={index} className={`round round-${round.completed}`}>
            {index + 1}
          </div>
        ))}
      </div>
      <button className="scroll-btn" onClick={scrollRight}>{">"}</button>
    </div>
  );
}

export default RoundScroller;
