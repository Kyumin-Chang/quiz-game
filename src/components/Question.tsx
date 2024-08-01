import React from 'react';

interface QuestionProps {
    question: {
        questionText: string;
        answerOptions: { answerText: string; isCorrect: boolean }[];
    };
    handleAnswerOptionClick: (isCorrect: boolean, answerText: string) => void;
}

const Question: React.FC<QuestionProps> = ({ question, handleAnswerOptionClick }) => {
    return (
        <div className="question-section">
            <div className="question-text">{question.questionText}</div>
            <div className="answer-section">
                {question.answerOptions.map((answerOption, index) => (
                    <button className="btn btn-secondary" key={index} onClick={() => handleAnswerOptionClick(answerOption.isCorrect, answerOption.answerText)}>
                        {answerOption.answerText}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Question;
