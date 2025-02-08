import React from "react";

function TrueFalseQuestion({ data }) {
  return (
    <div>
      <h4>True/False Question</h4>
      <input type="text" placeholder="Enter your question here" />
      <div>
        <label>
          <input type="radio" name="trueFalse" value="true" /> True
        </label>
        <label>
          <input type="radio" name="trueFalse" value="false" /> False
        </label>
      </div>
    </div>
  );
}

export default TrueFalseQuestion;
