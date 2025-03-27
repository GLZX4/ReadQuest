import React from "react";
import "../../styles/questions/fillInTheBlank.css";

const FillInTheBlankQuestion = ({ question, onAnswer, timer }) => {
  if (!question || !question.answeroptions) return <p>Loading...</p>;

  return (
    <div className="round-container">
      <div className="question-timer-container">
        <div className="questionNum">Question {question.questionid}</div>
        <div className="timer">{timer}s</div>
      </div>

      <div className="question-context-container">
        <span>{question.questiontext}</span>
      </div>

      <div className="question-text-container">
        <span>{question.questioncontext || "Pick the correct letter to fill the blank"}</span>
      </div>

      <div className="answers-container">
        {question.answeroptions.map(({ option, label }, index) => (
          <button
            key={index}
            className={`answer-button answer-${index + 1}`}
            onClick={() => onAnswer(option)}
          >
            {option}: {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FillInTheBlankQuestion;
