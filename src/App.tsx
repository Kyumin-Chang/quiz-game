import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import AdminLogin from './pages/AdminLogin';
import AdminPage from './pages/AdminPage';
import { QuizProvider } from './context/QuizContext';

const App: React.FC = () => {
    return (
        <QuizProvider>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminPage />} />
            </Routes>
        </QuizProvider>
    );
};

export default App;
