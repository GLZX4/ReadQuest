import React, { useState, useEffect } from "react";
import "../../styles/addQuestions/multipleChoiceSet.css";

function MultipleChoiceQuestion({ data, onChange }) {
  const [question, setQuestion] = useState(data.question || "");
  const [options, setOptions] = useState(data.options || ["", "", "", ""]);
  const [correctOption, setCorrectOption] = useState(data.correctOption || null);

  useEffect(() => {
    onChange({ question, options, correctOption });
  }, [question, options, correctOption, onChange]);

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  return (
    <div className="multiple-choice-container">
      <h3>Multiple Choice Question</h3>
      <input
        className="question-input"
        type="text"
        placeholder="Enter your question here"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <div className="options-grid">
        {options.map((option, index) => (
          <input
            className="option-input"
            key={index}
            type="text"
            placeholder={`Option ${index + 1}`}
            value={option}
            onChange={(e) => handleOptionChange(index, e.target.value)}
          />
        ))}
      </div>

      <div className="correct-ans-select">
        <h3>Select the Correct Answer:</h3>
        <select
          value={correctOption}
          onChange={(e) => setCorrectOption(e.target.value)}
        >
          <option value="" disabled>
            Select the correct option
          </option>
          {options.map((_, index) => (
            <option key={index} value={index}>
              Option {index + 1}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default MultipleChoiceQuestion;
