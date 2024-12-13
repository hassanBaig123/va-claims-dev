import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/pro-light-svg-icons";

interface TodoNextStepProps {
  message: string;
}

const TodoNextStep: React.FC<TodoNextStepProps> = ({ message }) => {
  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg">
      <div className="flex items-center">
        <FontAwesomeIcon icon={faArrowRight} className="text-blue-500 w-5 h-5 mr-2" />
        <h2 className="text-lg font-semibold text-blue-700">What to do Next:</h2>
      </div>
      <p className="mt-2 text-blue-600">{message}</p>
    </div>
  );
};

export default TodoNextStep;