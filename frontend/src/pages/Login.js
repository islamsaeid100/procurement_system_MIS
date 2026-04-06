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
            const response = await axios.post('http://127.0.0.1:8000/api/token/', {
                username: username,
                password: password
            });
            
            // حفظ التوكن في المتصفح
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            
            window.location.href = "/"; // توجيه للداشبورد بعد النجاح
        } catch (error) {
            alert("بيانات الدخول غير صحيحة يا إسلام، تأكد من زميلك!");
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <form onSubmit={handleLogin} style={{ background: '#fff', padding: '40px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', width: '350px' }}>
                <h2 style={{ textAlign: 'center', color: '#2c3e50' }}>PMS Login</h2>
                <input 
                    type="text" placeholder="Username" 
                    style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ddd' }}
                    onChange={(e) => setUsername(e.target.value)} required 
                />
                <input 
                    type="password" placeholder="Password" 
                    style={{ width: '100%', padding: '10px', marginBottom: '20px', borderRadius: '5px', border: '1px solid #ddd' }}
                    onChange={(e) => setPassword(e.target.value)} required 
                />
                <button type="submit" style={{ width: '100%', padding: '12px', background: '#3498db', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Login to System
                </button>
            </form>
        </div>
    );
};

export default Login;
