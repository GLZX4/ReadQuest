import React from "react";
import MultipleChoiceQuestion from "./questions/MultipleChoiceQuestions";
import DragDropQuestion from "./questions/DragDropQuestions";
import TrueFalseQuestion from "./questions/TrueFalseQuestion";

const QuestionRenderer = ({ question, onAnswer, timer }) => {
    console.log("QuestionRenderer question: ", question);
    console.log("QuestionRenderer answeroptions: ", question.answeroptions);
    console.log("question.questiontype: ", question.questiontype);
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
        default:
            return <p>Unknown question type: {question.questiontype}</p>;    
        }
};

export default QuestionRenderer;