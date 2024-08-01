import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Question from '../components/Question';
import Modal from '../components/Modal';
import { useQuiz } from '../context/QuizContext';
import '../styles/Quiz.css';

const Quiz: React.FC = () => {
    const { questions } = useQuiz();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [isQuizFinished, setIsQuizFinished] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [userAnswers, setUserAnswers] = useState<string[]>([]);
    const [timeLeft, setTimeLeft] = useState(5);
    const navigate = useNavigate();

    const resetTimer = useCallback(() => {
        setTimeLeft(5);
    }, []);

    const handleAnswerOptionClick = (isCorrect: boolean, answerText: string) => {
        if (isCorrect) {
            setScore((prevScore) => prevScore + 1);
        }
        setUserAnswers((prevAnswers) => [...prevAnswers, answerText]);
        handleNextQuestion();
    };

    const handleNextQuestion = useCallback(() => {
        const nextQuestion = currentQuestionIndex + 1;
        if (nextQuestion < questions.length) {
            setCurrentQuestionIndex(nextQuestion);
            resetTimer();
        } else {
            setIsQuizFinished(true);
        }
    }, [currentQuestionIndex, questions.length, resetTimer]);

    useEffect(() => {
        if (timeLeft <= 0) {
            setUserAnswers((prevAnswers) => [...prevAnswers, '']);
            handleNextQuestion();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => Math.max(prev - 0.1, 0));
        }, 100);

        return () => clearInterval(timer);
    }, [timeLeft, handleNextQuestion]);

    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleBackToMain = () => {
        navigate('/');
    };

    return (
        <div className="quiz container">
            {isQuizFinished ? (
                <div className="score-section text-center">
                    <h2 className="mb-4">최종 스코어 : {questions.length} 문제 중에서 {score}문제를 맞췄습니다!</h2>
                    <button className="btn" onClick={handleShowModal}>해설 보기</button>
                    <button className="btn" onClick={handleBackToMain}>메인 페이지로 돌아가기</button>
                    <Modal isOpen={showModal} onClose={handleCloseModal}>
                        <h2>해설</h2>
                        <ul className="list-group">
                            {questions.map((question, index) => (
                                <li key={index} className="list-group-item">
                                    <p>문제 {index + 1}: {question.questionText}</p>
                                    <p>내 답: {userAnswers[index]}</p>
                                    <p>정답: {question.answerOptions.find(option => option.isCorrect)?.answerText}</p>
                                </li>
                            ))}
                        </ul>
                    </Modal>
                </div>
            ) : (
                <>
                    <div className="timer">
                        <div className="time-bar mb-3">
                            <div className="time-left" style={{ width: `${(timeLeft / 5) * 100}%` }}></div>
                        </div>
                        <h5>남은 시간: {timeLeft.toFixed(1)}초</h5>
                    </div>
                    <div className="container">
                        <Question
                            question={questions[currentQuestionIndex]}
                            handleAnswerOptionClick={(isCorrect, answerText) => handleAnswerOptionClick(isCorrect, answerText)}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default Quiz;
