import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiGrid, FiBox, FiShoppingBag, FiUsers } from 'react-icons/fi';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="admin-layout container section animate-fadeIn">
      <aside className="admin-sidebar card">
        <div className="sidebar-header">
          <h3>Admin Panel</h3>
        </div>
        <nav className="sidebar-nav">
          <Link to="/admin" className={isActive('/admin') ? 'active' : ''}>
            <FiGrid /> Dashboard
          </Link>
          <Link to="/admin/products" className={isActive('/admin/products') ? 'active' : ''}>
            <FiBox /> Products
          </Link>
          <Link to="/admin/orders" className={isActive('/admin/orders') ? 'active' : ''}>
            <FiShoppingBag /> Orders
          </Link>
          <Link to="/admin/staff" className={isActive('/admin/staff') ? 'active' : ''}>
            <FiUsers /> Staff
          </Link>
        </nav>
      </aside>
      <main className="admin-content">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
