import React from 'react';
import { QuestionFactory } from './QuestionFactory';
import { AnswersState } from '@/models/local/types';

interface DynamicFormProps {
  questions: any[];
  answers: AnswersState[];
  updateAnswer: (groupIndex: number, questionIndex: number, answer: any) => void;
  currentGroupIndex: number;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ questions, answers, updateAnswer, currentGroupIndex }) => {
  const currentGroup = questions[currentGroupIndex];
  // Helper function to find an answer by questionId
  const findAnswer = (questionIndex: number) => {
    const answer = answers[currentGroupIndex]?.[questionIndex.toString()];
    return answer || '';
  };

  // Handler to update the answer in the parent component's state
  const handleChange = (questionIndex: number) => (answer: any) => {
    updateAnswer(currentGroupIndex, questionIndex, answer);
  };

  return (
    <form>
        {currentGroup && (
            <div>
                <h2>{currentGroup.title}</h2>
                {currentGroup.questions.map((question: any, index: number) => (
                    <div key={index}>
                        <QuestionFactory
                            question={question}
                            value={findAnswer(index)}
                            onChange={handleChange(index)}
                        />
                    </div>
                ))}
            </div>
        )}
    </form>
  );
};

export default DynamicForm;