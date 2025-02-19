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
        <div className="timer">{timer}s</div> {/* Assuming fixed 30s timer */}
        <div className="starProgress">
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
        </div>
      </div>

      {/* Question Context */}
      <div className="question-context-container">
        <span>{question.questiontext}</span>
      </div>

      {/* Actual Question Text */}
      <div className="question-text-container">
        <span>{question.questioncontext || "Read the question carefully!"}</span>
      </div>

      {/* Answer Options Grid */}
      <div className="answers-container">
        {options.map((option, index) => (
          <button
            key={index}
            className={`answer-button answer-${index + 1}`} // Matches .answer-1, .answer-2, etc.
            onClick={() => onAnswer(option.id)}
          >
            {option.option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MultipleChoiceQuestion;
