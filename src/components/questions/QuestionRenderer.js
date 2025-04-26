import React from "react";
import MultipleChoiceQuestion from "./MultipleChoiceQuestions";
import DragDropQuestion from "./DragDropQuestions";
import TrueFalseQuestion from "./TrueFalseQuestion";
import FillInTheBlankQuestion from "./FillInTheBlankQuestion";

const QuestionRenderer = ({ question, onAnswer, timer }) => {

    switch (question.questiontype) {
        case "multipleChoice":
            return <MultipleChoiceQuestion 
            question={question}
            options={question.answeroptions}
            onAnswer={onAnswer}
            timer={timer}
            />;
        case "drag_drop":
            return <DragDropQuestion 
            question={question} 
            onAnswer={onAnswer} 
            timer={timer}
            />;
        case "trueFalse":
            return <TrueFalseQuestion 
            question={question} 
            onAnswer={onAnswer} 
            timer={timer}
            />;
        case "fillInTheBlank":
            return <FillInTheBlankQuestion 
            question={question} 
            onAnswer={onAnswer} 
            timer={timer}
         />;
        default:
            return <p>Unknown question type: {question.questiontype}</p>;    
        }
};

export default QuestionRenderer;