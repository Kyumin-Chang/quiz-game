import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import '../styles/AdminPage.css';

interface Answer {
    answerText: string;
    isCorrect: boolean;
}

interface Question {
    questionText: string;
    answerOptions: Answer[];
}

const AdminPage: React.FC = () => {
    const { questions, setQuestions } = useQuiz();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (currentQuestionIndex >= questions.length) {
            setCurrentQuestionIndex(questions.length - 1);
        }
    }, [questions, currentQuestionIndex]);

    const validateQuestion = useCallback((question: Question) => {
        if (question.questionText.trim() === '') {
            setErrorMessage('모든 질문을 입력해주세요.');
            return false;
        }
        if (question.answerOptions.some(answer => answer.answerText.trim() === '')) {
            setErrorMessage('모든 답변을 입력해주세요.');
            return false;
        }
        if (!question.answerOptions.some(answer => answer.isCorrect)) {
            setErrorMessage('정답을 표시해 주세요.');
            return false;
        }
        setErrorMessage('');
        return true;
    }, []);

    const validateAllQuestions = useCallback(() => {
        for (const question of questions) {
            if (!validateQuestion(question)) return false;
        }
        return true;
    }, [questions, validateQuestion]);

    const handleAddQuestion = () => {
        if (!validateQuestion(questions[currentQuestionIndex])) return;
        setQuestions(prevQuestions => [
            ...prevQuestions,
            {
                questionText: '',
                answerOptions: [
                    { answerText: '', isCorrect: false },
                    { answerText: '', isCorrect: false },
                    { answerText: '', isCorrect: false },
                    { answerText: '', isCorrect: false },
                ],
            },
        ]);
        setCurrentQuestionIndex(questions.length);
    };

    const handleDeleteQuestion = () => {
        setQuestions(prevQuestions => prevQuestions.filter((_, index) => index !== currentQuestionIndex));
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prevIndex => prevIndex - 1);
        }
    };

    const handleQuestionChange = (value: string) => {
        setQuestions(prevQuestions => {
            const updatedQuestions = [...prevQuestions];
            updatedQuestions[currentQuestionIndex].questionText = value;
            return updatedQuestions;
        });
        setErrorMessage('');
    };

    const handleAnswerChange = (answerIndex: number, value: string) => {
        setQuestions(prevQuestions => {
            const updatedQuestions = [...prevQuestions];
            updatedQuestions[currentQuestionIndex].answerOptions[answerIndex].answerText = value;
            return updatedQuestions;
        });
        setErrorMessage('');
    };

    const handleIsCorrectChange = (answerIndex: number) => {
        setQuestions(prevQuestions => {
            const updatedQuestions = [...prevQuestions];
            updatedQuestions[currentQuestionIndex].answerOptions = updatedQuestions[currentQuestionIndex].answerOptions.map((answer, index) => ({
                ...answer,
                isCorrect: index === answerIndex,
            }));
            return updatedQuestions;
        });
    };

    const handleNavigation = (direction: 'previous' | 'next') => {
        if (!validateQuestion(questions[currentQuestionIndex])) return;
        setCurrentQuestionIndex(prevIndex => {
            if (direction === 'previous' && prevIndex > 0) {
                return prevIndex - 1;
            } else if (direction === 'next' && prevIndex < questions.length - 1) {
                return prevIndex + 1;
            }
            return prevIndex;
        });
    };

    const handleBackToMain = () => {
        if (validateAllQuestions()) {
            navigate('/');
        }
    };

    return (
        <div className="admin-page container">
            <div className="button-group">
                <button onClick={handleAddQuestion}>문제 추가</button>
                <button onClick={handleDeleteQuestion} disabled={questions.length === 0}>문제 삭제</button>
            </div>
            {questions.length > 0 && (
                <div className="question-edit">
                    <input
                        type="text"
                        value={questions[currentQuestionIndex].questionText}
                        onChange={(e) => handleQuestionChange(e.target.value)}
                        placeholder="질문을 입력하세요"
                    />
                    {questions[currentQuestionIndex].answerOptions.map((answer: Answer, aIndex: number) => (
                        <div key={aIndex} className="answer-option">
                            <input
                                type="text"
                                value={answer.answerText}
                                onChange={(e) => handleAnswerChange(aIndex, e.target.value)}
                                placeholder={`답변 ${aIndex + 1}`}
                                className="answer-input"
                            />
                            <input
                                type="radio"
                                name={`correct-answer-${currentQuestionIndex}`}
                                checked={answer.isCorrect}
                                onChange={() => handleIsCorrectChange(aIndex)}
                                className="answer-radio"
                            />
                        </div>
                    ))}
                </div>
            )}
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <div className="navigation-buttons">
                <button onClick={() => handleNavigation('previous')} disabled={currentQuestionIndex === 0}>
                    이전
                </button>
                <button onClick={() => handleNavigation('next')} disabled={currentQuestionIndex === questions.length - 1}>
                    다음
                </button>
            </div>
            <button className="back-button" onClick={handleBackToMain}>메인 페이지로 돌아가기</button>
        </div>
    );
};

export default AdminPage;
