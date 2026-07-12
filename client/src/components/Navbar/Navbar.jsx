import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiSearch, FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cartCount } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  const isHome = location.pathname === '/';

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`navbar ${isHome && !scrolled ? 'transparent' : 'solid glass'}`}>
      <div className="container nav-container">
        <Link to="/" className="nav-logo">
          <img src="/logo.jpg" alt="Momo Cafe Logo" className="logo-img" onError={(e) => {
            e.target.style.display = 'none';
          }} />
          <span className="logo-text">Momo Cafe</span>
        </Link>

        <nav className={`nav-links ${isOpen ? 'active' : ''}`}>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''} onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/menu" className={location.pathname === '/menu' ? 'active' : ''} onClick={() => setIsOpen(false)}>Menu</Link>
          <Link to="/about" className={location.pathname === '/about' ? 'active' : ''} onClick={() => setIsOpen(false)}>About</Link>
          <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''} onClick={() => setIsOpen(false)}>Contact</Link>
          
        </nav>

        <div className="nav-icons-desktop">
          <button className="icon-btn" onClick={toggleDarkMode}>
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>
          <Link to="/cart" className="icon-btn cart-btn">
            <FiShoppingCart />
            {cartCount > 0 && <span className="cart-badge animate-bounce">{cartCount}</span>}
          </Link>
          {isAuthenticated ? (
            <div className="user-dropdown">
              <button className="icon-btn"><FiUser /></button>
              <div className="dropdown-menu">
                <div className="dropdown-header">Hi, {user?.name.split(' ')[0]}</div>
                <Link to="/orders">My Orders</Link>
                {user?.role === 'admin' && <Link to="/admin">Admin Panel</Link>}
                {user?.role === 'staff' && <Link to="/staff">Staff Panel</Link>}
                <button onClick={logout}>Logout</button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm login-desktop">Login</Link>
          )}

          <button className="mobile-toggle" onClick={toggleMenu}>
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
