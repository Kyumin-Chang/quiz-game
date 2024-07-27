import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin: React.FC = () => {
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === '9999') {
            navigate('/admin');
        } else {
            alert('비밀번호가 틀렸습니다.');
        }
    };

    return (
        <div className="admin-login">
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호를 입력하세요"
                />
                <button type="submit">로그인</button>
            </form>
        </div>
    );
};

export default AdminLogin;
