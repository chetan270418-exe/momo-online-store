import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FiHome, FiGrid, FiShoppingCart, FiUser } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './BottomNav.css';

const BottomNav = () => {
  const { cartCount } = useCart();
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // Determine profile link based on auth status and role
  let profileLink = '/login';
  if (isAuthenticated) {
    if (user?.role === 'admin') profileLink = '/admin';
    else if (user?.role === 'staff') profileLink = '/staff';
    else profileLink = '/orders';
  }

  return (
    <nav className="bottom-nav">
      <NavLink 
        to="/" 
        className={({ isActive }) => `bottom-nav-item ${isActive && location.pathname === '/' ? 'active' : ''}`}
      >
        <FiHome className="bottom-nav-icon" />
        <span>Home</span>
      </NavLink>

      <NavLink 
        to="/menu" 
        className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
      >
        <FiGrid className="bottom-nav-icon" />
        <span>Menu</span>
      </NavLink>

      <NavLink 
        to="/cart" 
        className={({ isActive }) => `bottom-nav-item cart-nav-item ${isActive ? 'active' : ''}`}
      >
        <div className="cart-icon-wrapper">
          <FiShoppingCart className="bottom-nav-icon" />
          {cartCount > 0 && <span className="bottom-cart-badge">{cartCount}</span>}
        </div>
        <span>Cart</span>
      </NavLink>

      <NavLink 
        to={profileLink} 
        className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
      >
        <FiUser className="bottom-nav-icon" />
        <span>{isAuthenticated ? 'Profile' : 'Login'}</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;
