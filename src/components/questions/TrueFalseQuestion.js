import React, { useState } from "react";
import "../../styles/questions/trueFalseQuestion.css";

const TrueFalseQuestion = ({ question, onAnswer, timer,  questionNumber, totalQuestions  }) => {
    const [selected, setSelected] = useState(null);

    const handleAnswer = (answer) => {
        setSelected(answer);
        onAnswer(answer);
    };

    return (
        <div className="round-container-dragDrop">
            <div className="question-info-container">
                {timer && <p className="timer">Time left: {timer}s</p>}
                <h2>Question {questionNumber} of {totalQuestions}</h2>
            </div>
            <div className="true-false-question">
                <h2 className="question-text">{question.questiontext}</h2>
                <div className="true-false-options">
                    <button 
                        className={`true-button ${selected === "true" ? "selected" : ""}`}
                        onClick={() => handleAnswer("true")}
                    >True
                    </button>
                    <button 
                        className={`false-button ${selected === "false" ? "selected" : ""}`}
                        onClick={() => handleAnswer("false")}
                    >False
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TrueFalseQuestion;
