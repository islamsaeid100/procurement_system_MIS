import React, { useState, useEffect } from 'react'; // ضيفنا useState و useEffect
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Suppliers from './pages/Suppliers';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Invoices from './pages/Invoices';
import Login from './pages/Login';

function App() {
  // استخدام State عشان الأبلكيشن يحس بتغيير تسجيل الدخول فوراً
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access_token'));

  // دي وظيفتها تراقب الـ localStorage لو حصل فيه تغيير
  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(!!localStorage.getItem('access_token'));
    };
    
    // بنسمع لأي تغيير يحصل في الـ Storage (زي اللوج إن واللوج أوت)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  return (
    <Router>
      <div className="main-wrapper">
        <Routes>
          {/* حالة عدم تسجيل الدخول */}
          {!isAuthenticated ? (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          ) : (
            /* حالة تسجيل الدخول */
            <>
              <Route
                path="*"
                element={
                  <>
                    <Navbar />
                    <div className="container">
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/suppliers" element={<Suppliers />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/invoices" element={<Invoices />} />
                        <Route path="/login" element={<Navigate to="/" replace />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </div>
                    <footer className="no-print" style={{ textAlign: 'center', padding: '20px', color: '#95a5a6', fontSize: '0.9em' }}>
                        © 2026 Procurement Management System | Welcome, Islam
                    </footer>
                  </>
                }
              />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;