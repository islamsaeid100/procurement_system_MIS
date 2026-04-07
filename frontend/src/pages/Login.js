<<<<<<< HEAD
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
//تست
=======
import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/token/', {
                username: username,
                password: password
            });
            
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            
            window.location.href = "/";
        } catch (error) {
            console.error("Login error:", error.response?.data);
            alert("Invalid credentials or server error!");
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#F3F4F4' }}>
            <form onSubmit={handleLogin} style={{ background: '#ffffff', padding: '50px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', width: '400px', textAlign: 'center' }}>
                <h2 style={{ marginBottom: '30px', color: '#2C2C2C', fontWeight: '700' }}>PMS Login</h2>
                <input 
                    type="text" placeholder="Username" 
                    style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }}
                    onChange={(e) => setUsername(e.target.value)} required 
                />
                <input 
                    type="password" placeholder="Password" 
                    style={{ width: '100%', padding: '12px', marginBottom: '30px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }}
                    onChange={(e) => setPassword(e.target.value)} required 
                />
                <button type="submit" style={{ width: '100%', padding: '14px', background: '#853953', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                    Login to System
                </button>
            </form>
        </div>
    );
};

export default Login;
>>>>>>> 0f69498e7aae3db51c1316b76db8a4a800ea3b4f
