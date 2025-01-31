import React from "react";

const MultipleChoiceQuestion = ({ question, onAnswer }) => {
  return (
    <div className="multiple-choice-question">
      <h2>{question.text}</h2>
      <div className="answer-options">
        {question.answerOptions.map((option, index) => (
          <button
            key={index}
            className="answer-button"
            onClick={() => onAnswer(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MultipleChoiceQuestion;
