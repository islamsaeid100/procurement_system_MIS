import React, { useState, useEffect } from 'react';
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
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access_token'));

  // تحديث الحالة لو حصل تغيير (للاحتياط)
  useEffect(() => {
    const handleAuthChange = () => {
      setIsAuthenticated(!!localStorage.getItem('access_token'));
    };
    window.addEventListener('storage', handleAuthChange);
    return () => window.removeEventListener('storage', handleAuthChange);
  }, []);

  return (
    <Router>
      <div className="main-wrapper">
        {/* النجمة هنا تعني أن الـ Navbar يظهر فقط لو مسجل دخول */}
        {isAuthenticated && <Navbar />}
        
        <div className={isAuthenticated ? "container" : "auth-container"}>
          <Routes>
            {/* المسارات العامة */}
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} />

            {/* المسارات المحمية */}
            <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />
            <Route path="/suppliers" element={isAuthenticated ? <Suppliers /> : <Navigate to="/login" replace />} />
            <Route path="/products" element={isAuthenticated ? <Products /> : <Navigate to="/login" replace />} />
            <Route path="/orders" element={isAuthenticated ? <Orders /> : <Navigate to="/login" replace />} />
            <Route path="/invoices" element={isAuthenticated ? <Invoices /> : <Navigate to="/login" replace />} />

            {/* أي مسار غير معروف */}
            <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
          </Routes>
        </div>

        {isAuthenticated && (
          <footer className="no-print" style={{ textAlign: 'center', padding: '20px', color: '#95a5a6', fontSize: '0.9em' }}>
              © 2026 Procurement Management System | Welcome, Islam
          </footer>
        )}
      </div>
    </Router>
  );
}

export default App;