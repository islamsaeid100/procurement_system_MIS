import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// استدعاء المكونات والصفحات
import Navbar from './components/Navbar'; // الـ Navbar الجديد اللي فيه اللوجو
import Dashboard from './pages/Dashboard';
import Suppliers from './pages/Suppliers';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Invoices from './pages/Invoices';
import Login from './pages/Login';

function App() {
  // التأكد من وجود التوكن (accessToken أو access_token حسب اللي بتخزنه)
  const isAuthenticated = !!localStorage.getItem('access_token');

  return (
    <Router>
      <div className="main-wrapper">
        
        {!isAuthenticated ? (
          /* 1. حالة عدم تسجيل الدخول: يظهر اللوجين فقط */
          <div className="auth-container">
            <Routes>
              <Route path="/login" element={<Login />} />
              {/* أي رابط يكتبه غير اللوجين يرجعه للوجين أوتوماتيك */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        ) : (
          /* 2. حالة تسجيل الدخول: يظهر السيستم كامل */
          <>
            {/* استدعاء الـ Navbar اللي عملناه في ملف مستقل */}
            <Navbar />

            <div className="container">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/suppliers" element={<Suppliers />} />
                <Route path="/products" element={<Products />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/invoices" element={<Invoices />} />
                {/* حماية صفحة اللوجين: لو حاول يدخلها وهو مسجل يرجعه للداشبورد */}
                <Route path="/login" element={<Navigate to="/" replace />} />
                {/* لو كتب أي رابط غلط يرجعه للداشبورد */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>

            <footer className="no-print" style={{ textAlign: 'center', padding: '20px', color: '#95a5a6', fontSize: '0.9em' }}>
                © 2026 Procurement Management System | Welcome, Islam
            </footer>
          </>
        )}
      </div>
    </Router>
  );
}

export default App;