import React, { createContext, useContext, useState, ReactNode } from 'react';
import { quizData as initialQuizData } from '../data/quizData';

interface Answer {
    answerText: string;
    isCorrect: boolean;
}

interface Question {
    questionText: string;
    answerOptions: Answer[];
}

interface QuizContextType {
    questions: Question[];
    setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

interface QuizProviderProps {
    children: ReactNode;
}

export const QuizProvider: React.FC<QuizProviderProps> = ({ children }) => {
    const [questions, setQuestions] = useState<Question[]>(initialQuizData);

    return (
        <QuizContext.Provider value={{ questions, setQuestions }}>
            {children}
        </QuizContext.Provider>
    );
};

export const useQuiz = () => {
    const context = useContext(QuizContext);
    if (!context) {
        throw new Error('QuizContext가 존재하지 않습니다.');
    }
    return context;
};
