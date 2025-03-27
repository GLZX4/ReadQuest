import React from "react";
import "../../styles/questions/multipleChoiceQuestion.css";

const MultipleChoiceQuestion = ({ question, options, onAnswer, timer }) => {
  if (!question || !options) {
    return <p>Loading question...</p>; // Prevents crash if data is missing
  }

  return (
    <div className="round-container">
      {/* Timer & Question Number */}
      <div className="question-timer-container">
        <div className="questionNum">Question {question.questionid}</div>
        <div className="timer">{timer}s</div>
        <div className="starProgress">
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
        </div>
      </div>

      {/* Question Text */}
      <div className="question-context-container">
        <span>{question.questiontext}</span>
      </div>

      {/* Additional context if available */}
      <div className="question-text-container">
        <span>{question.questioncontext || "Read the question carefully!"}</span>
      </div>

      {/* Answer Options */}
      <div className="answers-container">
        {options.map(({ option, label }, index) => (
          <button
            key={index}
            className={`answer-button answer-${index + 1}`}
            onClick={() => onAnswer(option)} // Send "A", "B", "C", etc.
          >
            {label.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MultipleChoiceQuestion;
