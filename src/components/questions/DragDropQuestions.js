import React, { useState } from "react";
import ReturnButton from "../../features/round/returnButton";
import "../../styles/questions/dragDropQuestion.css"

const DragDropQuestion = ({ question, onAnswer, timer }) => {
  // ✅ Provide a default empty object if additionalData is missing
  const additionalData = question.additionalData || {};
  const dropZones = additionalData.dropZones || 4; // Default to 4 drop zones if undefined

  const [currentDrops, setCurrentDrops] = useState(Array(dropZones).fill(null));

  const handleDrop = (item, target) => {
    const updatedDrops = [...currentDrops];
    updatedDrops[target] = JSON.parse(item);
    setCurrentDrops(updatedDrops);
  };

  return (
    <div className="round-container-dragDrop">
      <div className="timerButton-Group">
        <h3 className="timer noselect">Time reamaining: <b>{timer}s</b></h3>
        <ReturnButton></ReturnButton>
      </div>
      <div className="drag-drop-question">
        <h2>{question.questiontext}</h2>

        <div className="drag-items">
          {question.answeroptions?.map((item, index) => (
            <div 
              key={index} 
              draggable 
              onDragStart={(e) => e.dataTransfer.setData("text", JSON.stringify(item))}
              className="draggable"
            >
              {item.label}
            </div>
          ))}
        </div>

        <div className="drop-zones">
          {Array.from({ length: dropZones }).map((_, index) => (
            <div
              key={index}
              className="drop-zone"
              onDrop={(e) => handleDrop(e.dataTransfer.getData("text"), index)}
              onDragOver={(e) => e.preventDefault()}
            >
              {currentDrops[index]?.label || "Drop here"}
            </div>
          ))}
        </div>

        <button className="submit-answer" onClick={() => onAnswer(currentDrops)}>Submit</button>
        </div>
      </div>
  );
};

export default DragDropQuestion;
