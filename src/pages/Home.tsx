import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/index.css';

const Home: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="container main-page">
            <h1 className="title">퀴즈 게임</h1>
            <div className="button-group">
                <button onClick={() => navigate('/quiz')}>게임 시작</button>
                <button onClick={() => navigate('/admin-login')}>관리자 페이지</button>
            </div>
        </div>
    );
};

export default Home;
