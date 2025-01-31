import React, { useState } from "react";

const DragDropQuestion = ({ question, onAnswer }) => {
  const [currentDrops, setCurrentDrops] = useState([]);

  const handleDrop = (item, target) => {
    const updatedDrops = [...currentDrops];
    updatedDrops[target] = item;
    setCurrentDrops(updatedDrops);
  };

  return (
    <div className="drag-drop-question">
      <h2>{question.text}</h2>
      <div className="drag-items">
        {question.additionalData.draggables.map((item, index) => (
          <div key={index} draggable>
            {item.label}
          </div>
        ))}
      </div>
      <div className="drop-zones">
        {question.additionalData.dropZones.map((zone, index) => (
          <div
            key={index}
            className="drop-zone"
            onDrop={(e) => handleDrop(e.dataTransfer.getData("text"), index)}
            onDragOver={(e) => e.preventDefault()}
          >
            {currentDrops[index] || "Drop here"}
          </div>
        ))}
      </div>
      <button onClick={() => onAnswer(currentDrops)}>Submit</button>
    </div>
  );
};

export default DragDropQuestion;
