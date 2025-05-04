import React from "react";
import MultipleChoiceQuestion from "./MultipleChoiceQuestions";
import DragDropQuestion from "./DragDropQuestions";
import TrueFalseQuestion from "./TrueFalseQuestion";
import FillInTheBlankQuestion from "./FillInTheBlankQuestion";

const QuestionRenderer = ({ question, onAnswer, timer, questionNumber, totalQuestions }) => {

    switch (question.questiontype) {
        case "multipleChoice":
            return <MultipleChoiceQuestion 
            question={question}
            options={question.answeroptions}
            onAnswer={onAnswer}
            timer={timer}
            questionNumber={questionNumber}
            totalQuestions={totalQuestions}
            />;
        case "drag_drop":
            return <DragDropQuestion 
            question={question} 
            onAnswer={onAnswer} 
            timer={timer}
            questionNumber={questionNumber}
            totalQuestions={totalQuestions}
            />;
        case "trueFalse":
            return <TrueFalseQuestion 
            question={question} 
            onAnswer={onAnswer} 
            timer={timer}
            questionNumber={questionNumber}
            totalQuestions={totalQuestions}
            />;
        case "fillInTheBlank":
            return <FillInTheBlankQuestion 
            question={question} 
            onAnswer={onAnswer} 
            timer={timer}
            questionNumber={questionNumber}
            totalQuestions={totalQuestions}
         />;
        default:
            return <p>Unknown question type: {question.questiontype}</p>;    
        }
};

export default QuestionRenderer;