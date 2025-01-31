import React from "react";
import MultipleChoiceQuestion from "./questions/MultipleChoiceQuestions";
import SentenceReorderQuestion from "./questions/SentenceReorderQuestion";
import DragDropQuestion from "./questions/DragDropQuestions";

const QuestionRenderer = ({ question, onAnswer }) => {
    switch (question.type) {
        case "multiple_choice":
            return <MultipleChoiceQuestion question={question} onAnswer={onAnswer} />;
        case "sentence_reorder":
            return <SentenceReorderQuestion question={question} onAnswer={onAnswer} />;
        case "drag_drop":
            return <DragDropQuestion question={question} onAnswer={onAnswer} />;
        default:
            return <div>Invalid question type</div>;
    }
};

export default QuestionRenderer;