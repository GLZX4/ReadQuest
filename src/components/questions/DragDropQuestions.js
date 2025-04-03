import React, { useState } from "react";
import ReturnButton from "../common/returnButton";
import "../../styles/questions/dragDropQuestion.css";

const DragDropQuestion = ({ question, onAnswer, timer }) => {
  const additionalData = question.additionalData || {};
  const dropZones = Math.max(
    additionalData.dropZones || 0,
    question.answeroptions?.length || 0
  );
  

  const [currentDrops, setCurrentDrops] = useState(Array(dropZones).fill(null));

  const handleDrop = (item, target) => {
    const updatedDrops = [...currentDrops];
    updatedDrops[target] = JSON.parse(item);
    setCurrentDrops(updatedDrops);
  };

  const handleSubmit = () => {
    const formattedAnswer = currentDrops
        .map((item, index) => ({
            id: item?.id ?? null,
            position: index + 1
        }))
        .filter(item => item.id !== null);

    console.log("📝 Formatted Answer Sent to Backend:", JSON.stringify(formattedAnswer, null, 2));

    onAnswer(formattedAnswer);
};


  return (
    <div className="round-container-dragDrop">
      <div className="timerButton-Group">
        <h3 className="timer noselect">Time remaining: <b>{timer}s</b></h3>
        <ReturnButton />
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

        <button className="submit-answer" onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default DragDropQuestion;
