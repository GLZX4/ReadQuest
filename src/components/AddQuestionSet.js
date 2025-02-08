import React, { useState } from "react";
import MultipleChoiceQuestion from "../components/AddingQuestions/MultipleChoiceQuestion";
import FillInTheBlankQuestion from "../components/AddingQuestions/FillInTheBlankQuestion";
import TrueFalseQuestion from "../components/AddingQuestions/TrueFalseQuestion";
import "../styles/addQuestionSet.css";

function AddQuestionSet({ onClose }) {
  const [questions, setQuestions] = useState([
    { type: "", data: {} },
  ]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleQuestionTypeSelect = (type) => {
    const updatedQuestions = questions.map((q) => ({ ...q, type }));
    setQuestions(updatedQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { type: questions[0].type, data: {} }]);
  };

  const handleRemoveQuestion = () => {
    if (questions.length > 1) {
      const updatedQuestions = questions.filter(
        (_, index) => index !== currentQuestionIndex
      );
      setQuestions(updatedQuestions);
      setCurrentQuestionIndex(Math.max(currentQuestionIndex - 1, 0));
    }
  };

  const handleQuestionDataChange = (index, newData) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].data = newData;
    setQuestions(updatedQuestions);
  };

  const renderQuestionComponent = (question, index) => {
    switch (question.type) {
      case "multipleChoice":
        return (
          <MultipleChoiceQuestion
            key={index}
            data={question.data}
            onChange={(newData) => handleQuestionDataChange(index, newData)}
          />
        );
      case "trueFalse":
        return (
          <TrueFalseQuestion
            key={index}
            data={question.data}
            onChange={(newData) => handleQuestionDataChange(index, newData)}
          />
        );
      case "fillInTheBlank":
        return (
          <FillInTheBlankQuestion
            key={index}
            data={question.data}
            onChange={(newData) => handleQuestionDataChange(index, newData)}
          />
        );
      default:
        return <div>Please select a question type to begin.</div>;
    }
  };

  return (
    <div className="addQuestionSet-overlay">
      <div className="addQuestionSet-container">
        <div className="addQuestionSet-header">
          <h2>Add a New Question Set</h2>
          <button className="close-btn" onClick={onClose}>
            Close
          </button>
        </div>

        {/* Question Type Selection */}
        {!questions[0].type && (
          <div className="addQuestionSet-selectType">
            <h3>Select the Question Type for this Set:</h3>
            <div className="addQuestionSet-btnGroup">
              <button
                onClick={() => handleQuestionTypeSelect("multipleChoice")}
              >
                Multiple Choice
              </button>
              <button onClick={() => handleQuestionTypeSelect("trueFalse")}>
                True/False
              </button>
              <button
                onClick={() => handleQuestionTypeSelect("fillInTheBlank")}
              >
                Fill in the Blank
              </button>
            </div>
          </div>
        )}

        {/* Question Navigation */}
        {questions[0].type && (
          <>
            <div className="addQuestionSet-questionNums">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`question-circle ${
                    index === currentQuestionIndex ? "active" : ""
                  }`}
                  onClick={() => setCurrentQuestionIndex(index)}
                >
                  {index + 1}
                </div>
              ))}
            </div>

            {/* Current Question Editor */}
            <div className="addQuestionSet-questionContent">
              {renderQuestionComponent(
                questions[currentQuestionIndex],
                currentQuestionIndex
              )}
            </div>

            {/* Add/Remove Question Controls */}
            <div className="addQuestionSet-controls">
              <button className="addQuestion-btn" onClick={handleAddQuestion}>
                Add Question
              </button>
              <button
                className="removeQuestion-btn"
                onClick={handleRemoveQuestion}
              >
                Remove Question
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AddQuestionSet;
