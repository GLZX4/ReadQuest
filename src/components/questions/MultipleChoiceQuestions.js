import React from "react";
import "../../styles/questions/multipleChoiceQuestion.css";

const MultipleChoiceQuestion = ({ question, options, onAnswer, timer }) => {
  if (!question || !options) {
    return <p>Loading question...</p>;
  }

  return (
    <div className="round-container">
      <div className="question-timer-container">
        <div className="questionNum">Question {question.questionid}</div>
        <div className="timer">{timer}s</div>
        <div className="starProgress">
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
        </div>
      </div>

      <div className="question-context-container">
        <span>{question.questiontext}</span>
      </div>

      <div className="question-text-container">
        <span>{question.questioncontext || "Read the question carefully!"}</span>
      </div>

      <div className="answers-container">
        {options.map((item, index) => {
          let label = typeof item === "string" ? item : item.label;
          let optionValue = typeof item === "string" ? item : item.option;

          return (
            <button
              key={index}
              className={`answer-button answer-${index + 1}`}
              onClick={() => onAnswer(optionValue)}
            >
              {label ? label.toUpperCase() : "N/A"}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MultipleChoiceQuestion;
