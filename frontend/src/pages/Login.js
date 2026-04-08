import React, { useState } from 'react';
import api from '../services/api';
import logo from '../components/logo.png'; // استخدم اللوجو بتاعك هنا كمان

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('token/', credentials);
            // التسمية هنا هي سر النجاح:
            localStorage.setItem('access_token', res.data.access);
            localStorage.setItem('refresh_token', res.data.refresh);
            
            // دخول للسيستم
            window.location.href = '/';
        } catch (err) {
            alert("خطأ في بيانات الدخول، حاول مرة أخرى");
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit} style={styles.card}>
                <img src={logo} alt="Logo" style={{width: '70px', marginBottom: '10px'}} />
                <h2 style={{color: '#853953'}}>PMS Login</h2>
                <input 
                    type="text" placeholder="Username" 
                    onChange={e => setCredentials({...credentials, username: e.target.value})}
                    style={styles.input} required 
                />
                <input 
                    type="password" placeholder="Password" 
                    onChange={e => setCredentials({...credentials, password: e.target.value})}
                    style={styles.input} required 
                />
                <button type="submit" style={styles.button}>Login</button>
            </form>
        </div>
    );
};

const styles = {
    container: { display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#f4f4f4' },
    card: { background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', textAlign: 'center', width: '350px' },
    input: { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' },
    button: { width: '100%', padding: '12px', background: '#853953', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }
};

export default Login;