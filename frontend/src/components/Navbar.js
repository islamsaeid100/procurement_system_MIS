import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from './logo.png'; // اللوجو موجود معاك في نفس الفولدر

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // لازم نمسح نفس الاسم اللي App.js بيدور عليه
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        
        // إعادة تحميل الصفحة عشان App.js يحس إن التوكن اتمسح ويرجع للوجين
        window.location.href = '/login'; 
      };
      
    return (
        <nav className="no-print" style={styles.navbar}>
            <div style={styles.logoSection}>
                <img src={logo} alt="PMS Logo" style={styles.logoImg} />
                <span style={styles.brandName}>PMS System</span>
            </div>

            <ul style={styles.navLinks}>
                <li><Link to="/" style={styles.link}>Dashboard</Link></li>
                <li><Link to="/suppliers" style={styles.link}>Suppliers</Link></li>
                <li><Link to="/products" style={styles.link}>Products</Link></li>
                <li><Link to="/orders" style={styles.link}>Orders</Link></li>
                <li><Link to="/invoices" style={styles.link}>Invoices</Link></li>
            </ul>

            <button onClick={handleLogout} style={styles.logoutBtn}>Logout 🚪</button>
        </nav>
    );
};

// تنسيق بسيط وسريع
const styles = {
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 30px',
        background: '#fff',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        marginBottom: '20px'
    },
    logoSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },
    logoImg: {
        width: '40px',
        height: '40px',
        objectFit: 'contain'
    },
    brandName: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#853953'
    },
    navLinks: {
        display: 'flex',
        listStyle: 'none',
        gap: '20px',
        margin: 0
    },
    link: {
        textDecoration: 'none',
        color: '#333',
        fontWeight: '500'
    },
    logoutBtn: {
        background: '#e74c3c',
        color: 'white',
        border: 'none',
        padding: '7px 15px',
        borderRadius: '5px',
        cursor: 'pointer'
    }
};

export default Navbar;