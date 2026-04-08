import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import './App.css';

// استدعاء الصفحات
import Dashboard from './pages/Dashboard';
import Suppliers from './pages/Suppliers';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Invoices from './pages/Invoices';
import Login from './pages/Login'; // تأكد إنك عملت الملف ده يا إسلام

function App() {
  // التأكد هل اليوزر معاه مفتاح (Token) في المتصفح ولا لا
  const isAuthenticated = !!localStorage.getItem('access_token');

  // وظيفة تسجيل الخروج
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/'; // إعادة التوجيه للرئيسية (اللي هتبقى login)
  };

  return (
    <Router>
      <div className="main-wrapper">
        
        {/* لو مش مسجل دخول، اعرض صفحة الـ Login فقط */}
        {!isAuthenticated ? (
          <div className="auth-container">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        ) : (
          /* لو مسجل دخول، اعرض السيستم كامل بالـ Navbar */
          <>
            <nav className="navbar">
              <div className="logo">
                PMS System <span style={{fontSize: '10px', color: '#3498db'}}>SECURE</span>
              </div>
              <ul className="nav-links">
                <li><NavLink build to="/" end className={({ isActive }) => isActive ? "active-link" : ""}>Dashboard</NavLink></li>
                <li><NavLink to="/suppliers" className={({ isActive }) => isActive ? "active-link" : ""}>Suppliers</NavLink></li>
                <li><NavLink to="/products" className={({ isActive }) => isActive ? "active-link" : ""}>Products</NavLink></li>
                <li><NavLink to="/orders" className={({ isActive }) => isActive ? "active-link" : ""}>Orders</NavLink></li>
                <li><NavLink to="/invoices" className={({ isActive }) => isActive ? "active-link" : ""}>Invoices</NavLink></li>
                <li>
                  <button 
                    onClick={handleLogout} 
                    style={{
                      background: '#e74c3c', 
                      color: 'white', 
                      border: 'none', 
                      padding: '8px 15px', 
                      borderRadius: '5px', 
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      marginLeft: '15px'
                    }}>
                    Logout 🚪
                  </button>
                </li>
              </ul>
            </nav>

            <div className="container">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/suppliers" element={<Suppliers />} />
                <Route path="/products" element={<Products />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/invoices" element={<Invoices />} />
                {/* لو حاول يروح للـ login وهو مسجل دخول رجعه للداشبورد */}
                <Route path="/login" element={<Navigate to="/" replace />} />
              </Routes>
            </div>

            <footer style={{ textAlign: 'center', padding: '20px', color: '#95a5a6', fontSize: '0.9em' }}>
                © 2026 Procurement Management System | Welcome, Islam
            </footer>
          </>
        )}
      </div>
    </Router>
  );
}

export default App;