import React, { useState } from "react";
import MultipleChoiceQuestion from "./MultipleChoiceQuestion";
import FillInTheBlankQuestion from "./FillInTheBlankQuestion";
import TrueFalseQuestion from "./TrueFalseQuestion";
import "../../styles/addQuestionSet.css";

import axios from 'axios';

function AddQuestionSet({ onClose }) {

  const [difficulty, setDifficulty] = useState("easy");
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

  const handlePublishQuestionSet = async () => {
    try {
      const token = localStorage.getItem("token"); 
      const payload = {
        questions,
        questionType: questions[0].type,
        difficulty,
      };

      const response = await axios.post(
        "http://localhost:5000/api/tutor/add-Question-Set", 
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        alert("Question Set Published Successfully!");
        onClose();
      }
    } catch (error) {
      console.error("Error publishing question set:", error);
      alert("Failed to publish question set. Please try again.");
    }
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

            <div className="addQuestionSet-questionContent">
              {renderQuestionComponent(
                questions[currentQuestionIndex],
                currentQuestionIndex
              )}
            </div>

            <div className="addQuestionSet-difficulty">
              <h4>Select the Difficulty Level for Whole Round:</h4>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="addQuestionSet-controls">
              <button className="controlBtn add" onClick={handleAddQuestion}>
                Add Question
              </button>
              <button
                className="controlBtn remove"
                onClick={handleRemoveQuestion}
              >
                Remove Question
              </button>
              <button className="controlBtn publish"
              onClick={handlePublishQuestionSet}>
                Publish Question Set
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AddQuestionSet;
