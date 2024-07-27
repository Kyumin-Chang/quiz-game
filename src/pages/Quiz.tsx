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
        <div className="quiz">
            {isQuizFinished ? (
                <div className="score-section container">
                    최종 스코어 : {questions.length}문제 중에서 {score}문제를 맞췄습니다!
                    <button onClick={handleShowModal}>해설 보기</button>
                    <button onClick={handleBackToMain}>메인 페이지로 돌아가기</button>
                    <Modal isOpen={showModal} onClose={handleCloseModal}>
                        <h2>해설</h2>
                        <ul>
                            {questions.map((question, index) => (
                                <li key={index}>
                                    <p>문제 {index + 1}: {question.questionText}</p>
                                    <p>내 답: {userAnswers[index]}</p>
                                    <p>정답: {question.answerOptions.find(option => option.isCorrect)?.answerText}</p>
                                </li>
                            ))}
                        </ul>
                        <button className="modal-close-button" onClick={handleCloseModal}>닫기</button>
                    </Modal>
                </div>
            ) : (
                <>
                    <div className="timer container">
                        <div className="time-bar">
                            <div className="time-left" style={{ width: `${(timeLeft / 5) * 100}%` }}></div>
                        </div>
                        남은 시간: {timeLeft.toFixed(1)}초
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
