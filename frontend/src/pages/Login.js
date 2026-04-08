import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://127.0.0.1:8000/api/token/', { username, password });
            localStorage.setItem('access_token', res.data.access);
            localStorage.setItem('refresh_token', res.data.refresh);
            navigate('/');
        } catch (err) {
            alert("خطأ في تسجيل الدخول: تأكد من اسم المستخدم وكلمة المرور");
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f7f6' }}>
            <div style={{ background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', width: '350px' }}>
                <h2 style={{ textAlign: 'center', color: '#853953', marginBottom: '30px' }}>PMS Login</h2>
                <form onSubmit={handleLogin}>
                    <input 
                        type="text" placeholder="Username" 
                        style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box' }}
                        onChange={e => setUsername(e.target.value)} 
                    />
                    <input 
                        type="password" placeholder="Password" 
                        style={{ width: '100%', padding: '12px', marginBottom: '25px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box' }}
                        onChange={e => setPassword(e.target.value)} 
                    />
                    <button type="submit" style={{ width: '100%', padding: '12px', background: '#853953', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;