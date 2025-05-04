import React, { useState, useEffect } from "react";
import ReturnButton from "../common/returnButton";
import "../../styles/questions/dragDropQuestion.css";

const DragDropQuestion = ({ question, onAnswer, timer, questionNumber, totalQuestions  }) => {
  const additionalData = question.additionalData || {};
  const dropZones = Math.max(
    additionalData.dropZones || 0,
    question.answeroptions?.length || 0
  );

  const [availableItems, setAvailableItems] = useState(question.answeroptions || []);
  const [currentDrops, setCurrentDrops] = useState(Array(dropZones).fill(null));

  useEffect(() => {
    // Reset available items and current drops when the question changes
    setAvailableItems(question.answeroptions || []);
    setCurrentDrops(Array(dropZones).fill(null));
  }, [question]); // 👈 watch question

  const handleDrop = (itemString, targetIndex) => {
    if (!itemString) return;
  
    let item;
    try {
      item = JSON.parse(itemString);
    } catch (error) {
      console.warn("Invalid drop data:", itemString);
      return;
    }
  
    const updatedDrops = [...currentDrops];
    const updatedAvailable = [...availableItems];
  
    if (updatedDrops[targetIndex]) {
      updatedAvailable.push(updatedDrops[targetIndex]);
    }
  
    updatedDrops[targetIndex] = item;
  
    const indexInAvailable = updatedAvailable.findIndex(i => i.id === item.id);
    if (indexInAvailable !== -1) {
      updatedAvailable.splice(indexInAvailable, 1);
    }
  
    setCurrentDrops(updatedDrops);
    setAvailableItems(updatedAvailable);
  };
  

  const handleSubmit = () => {
    const formattedAnswer = currentDrops
      .map((item, index) => ({
        id: item?.id ?? null,
        position: index + 1
      }))
      .filter(item => item.id !== null);

    onAnswer(formattedAnswer);
  };

  return (
    <div className="round-container-dragDrop">
      <div className="timerButton-Group">
        <h2>Question {questionNumber} of {totalQuestions}</h2>
        <h3 className="timer noselect">Time remaining: <b>{timer}s</b></h3>
      </div>

      <div className="drag-drop-question">
        <h2>{question.questiontext}</h2>

        <div className="drag-items">
          {availableItems.map((item, index) => (
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
