import React, { useState } from 'react';
import api from '../services/api';
import logo from '../components/logo.png'; 

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('token/', credentials);
            localStorage.setItem('access_token', res.data.access);
            localStorage.setItem('refresh_token', res.data.refresh);
            window.location.href = '/';
        } catch (err) {
            alert("Username or Password incorrect. Please try again.");
        }
    };

    return (
        <div className="login-wrapper">
            {/* الكارت الزجاجي */}
            <form onSubmit={handleSubmit} className="page-content login-card">
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <img src={logo} alt="Logo" className="login-logo" />
                    <h2 style={{ color: 'var(--color-1)', marginBottom: '5px', fontSize: '1.8rem' }}>Welcome Back</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Please enter your details to login</p>
                </div>

                <div className="input-group-login">
                    <label>Username</label>
                    <input 
                        type="text" 
                        placeholder="Enter your username" 
                        onChange={e => setCredentials({...credentials, username: e.target.value})}
                        required 
                    />
                </div>

                <div className="input-group-login" style={{ marginTop: '20px' }}>
                    <label>Password</label>
                    <input 
                        type="password" 
                        placeholder="••••••••" 
                        onChange={e => setCredentials({...credentials, password: e.target.value})}
                        required 
                    />
                </div>

                <button type="submit" className="login-submit-btn">
                    Sign In to System
                </button>

                <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.8rem', color: '#94a3b8' }}>
                    SECURE PROCUREMENT MANAGEMENT SYSTEM © 2026
                </div>
            </form>

            <style>{`
                .login-wrapper {
                    display: flex;
                    height: 100vh;
                    align-items: center;
                    justify-content: center;
                    /* الخلفية والباترن هييجوا أوتوماتيك من App.css لأننا شيلنا الستايل اليدوي */
                }

                .login-card {
                    width: 100%;
                    max-width: 420px;
                    padding: 50px !important;
                    border-radius: 30px !important;
                    box-shadow: 0 20px 40px rgba(13, 17, 100, 0.1) !important;
                }

                .login-logo {
                    width: 80px;
                    height: 80px;
                    object-fit: contain;
                    margin-bottom: 15px;
                    /* فلتر خفيف عشان اللوجو يبرز */
                    filter: drop-shadow(0 5px 10px rgba(0,0,0,0.1));
                }

                .input-group-login label {
                    display: block;
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: var(--color-1);
                    margin-bottom: 8px;
                    margin-left: 5px;
                }

                .input-group-login input {
                    width: 100%;
                    padding: 14px;
                    border-radius: 15px;
                    border: 1.5px solid #e2e8f0;
                    background: #f8fafc;
                    box-sizing: border-box;
                    transition: all 0.3s ease;
                }

                .input-group-login input:focus {
                    border-color: var(--color-3);
                    background: #fff;
                    box-shadow: 0 0 0 4px rgba(234, 34, 100, 0.1);
                    outline: none;
                }

                .login-submit-btn {
                    width: 100%;
                    margin-top: 30px;
                    padding: 15px !important;
                    font-size: 1rem;
                    background: linear-gradient(90deg, var(--color-1), var(--color-2)) !important;
                    border-radius: 15px !important;
                    letter-spacing: 0.5px;
                }

                .login-submit-btn:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 10px 20px rgba(13, 17, 100, 0.2) !important;
                }
            `}</style>
        </div>
    );
};

export default Login;