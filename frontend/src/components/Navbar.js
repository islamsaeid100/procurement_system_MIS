import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from './logo.png';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
    };

    return (
        <nav className="navbar no-print">
            {/* الحاوية الجديدة الموزونة للبراند */}
            <div className="brand-container">
                <div className="logo-wrapper">
                    <img src={logo} alt="PMS Logo" className="navbar-logo" />
                </div>
                <div className="brand-text">
                    <span className="main-name">P.M.S</span>
                    <span className="sub-name">HICMIS G.Project</span>
                </div>
            </div>

            <ul className="nav-links">
                <li><NavLink to="/" end className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>Dashboard</NavLink></li>
                <li><NavLink to="/suppliers" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>Suppliers</NavLink></li>
                <li><NavLink to="/products" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>Products</NavLink></li>
                <li><NavLink to="/orders" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>Orders</NavLink></li>
                <li><NavLink to="/invoices" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>Invoices</NavLink></li>
            </ul>

            <button onClick={handleLogout} className="navbar-logout-btn">
                <span>Logout</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="logout-icon-svg">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
            </button>
        </nav>
    );
};

export default Navbar;