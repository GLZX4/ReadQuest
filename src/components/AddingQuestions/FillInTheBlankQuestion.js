import React from "react";

function FillInTheBlankQuestion({ data }) {
  return (
    <div>
      <h4>Fill in the Blank Question</h4>
      <input type="text" placeholder="Enter your question with a blank (e.g., 'The sky is ____.')" />
    </div>
  );
}

export default FillInTheBlankQuestion;
