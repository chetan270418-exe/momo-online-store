import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getKitchenOrders, updateKitchenOrderStatus } from '../../services/api';
import toast from 'react-hot-toast';
import { FiClock, FiCheckCircle, FiTruck, FiLogOut, FiRefreshCw } from 'react-icons/fi';
import './StaffDashboard.css';

const statusConfig = {
  'Placed':           { color: '#6366F1', bg: '#EEF2FF', label: 'New Order',      icon: '🆕' },
  'Confirmed':        { color: '#0891B2', bg: '#E0F7FA', label: 'Confirmed',       icon: '✅' },
  'Preparing':        { color: '#D97706', bg: '#FEF3C7', label: 'In Kitchen',      icon: '🍳' },
  'Out for Delivery': { color: '#16A34A', bg: '#DCFCE7', label: 'Out for Delivery',icon: '🛵' },
};

const StaffDashboard = () => {
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    if (isAuthenticated && user?.role === 'staff') {
      fetchOrders();
      // Auto-refresh every 30 seconds
      const interval = setInterval(() => {
        fetchOrders(true);
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, user]);

  const fetchOrders = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await getKitchenOrders();
      setOrders(data.orders);
      setLastRefresh(new Date());
    } catch (error) {
      if (!silent) toast.error('Failed to load kitchen orders');
    }
    if (!silent) setLoading(false);
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      await updateKitchenOrderStatus(orderId, newStatus);
      toast.success(`Order marked as "${newStatus}"`);
      fetchOrders(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update order');
    }
    setUpdating(null);
  };

  if (authLoading) return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  if (!isAuthenticated || user?.role !== 'staff') return <Navigate to="/login" replace />;

  const grouped = {
    'Placed': orders.filter(o => o.status === 'Placed'),
    'Confirmed': orders.filter(o => o.status === 'Confirmed'),
    'Preparing': orders.filter(o => o.status === 'Preparing'),
    'Out for Delivery': orders.filter(o => o.status === 'Out for Delivery'),
  };

  return (
    <div className="staff-shell">
      {/* Header */}
      <header className="staff-header">
        <div className="staff-header-left">
          <span className="staff-logo">🥟 Momo Cafe</span>
          <span className="staff-badge">Kitchen Panel</span>
        </div>
        <div className="staff-header-right">
          <span className="staff-welcome">Hi, {user?.name} 👋</span>
          <button className="staff-icon-btn" onClick={() => fetchOrders()} title="Refresh orders">
            <FiRefreshCw />
          </button>
          <button className="staff-icon-btn danger" onClick={logout} title="Logout">
            <FiLogOut />
          </button>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="staff-stats-bar">
        {Object.entries(statusConfig).map(([status, cfg]) => (
          <div key={status} className="staff-stat-chip" style={{ borderColor: cfg.color, color: cfg.color }}>
            <span>{cfg.icon}</span>
            <span className="stat-count">{grouped[status]?.length || 0}</span>
            <span className="stat-label">{cfg.label}</span>
          </div>
        ))}
        <span className="staff-refresh-time">
          <FiClock style={{ marginRight: '4px' }} />
          Last updated: {lastRefresh.toLocaleTimeString()}
        </span>
      </div>

      {/* Main Board */}
      <main className="staff-board">
        {loading ? (
          <div className="staff-loading">
            <div className="staff-spinner"></div>
            <p>Loading kitchen orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="staff-empty">
            <div style={{ fontSize: '4rem' }}>🎉</div>
            <h2>All clear!</h2>
            <p>No active orders right now. Auto-refreshing every 30 seconds.</p>
          </div>
        ) : (
          Object.entries(grouped).map(([status, statusOrders]) => (
            statusOrders.length > 0 && (
              <div key={status} className="staff-column">
                <div className="staff-column-header" style={{ borderColor: statusConfig[status].color, background: statusConfig[status].bg }}>
                  <span style={{ color: statusConfig[status].color }}>{statusConfig[status].icon} {statusConfig[status].label}</span>
                  <span className="staff-count-badge" style={{ background: statusConfig[status].color }}>{statusOrders.length}</span>
                </div>

                <div className="staff-cards">
                  {statusOrders.map(order => (
                    <div key={order._id} className="staff-order-card">
                      <div className="order-card-header">
                        <span className="order-id">#{order._id.slice(-6).toUpperCase()}</span>
                        <span className="order-time">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      <div className="order-customer">
                        <strong>{order.user?.name || 'Customer'}</strong>
                        {order.user?.phone && <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}> • {order.user.phone}</span>}
                      </div>

                      <div className="order-items">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="order-item-row">
                            <span className="item-qty">×{item.quantity}</span>
                            <span className="item-name">{item.name}</span>
                          </div>
                        ))}
                      </div>

                      {order.deliveryAddress?.phone && (
                        <div className="order-note">
                          📍 {order.deliveryAddress.street}, {order.deliveryAddress.city}
                        </div>
                      )}

                      <div className="order-card-footer">
                        <span className="order-total">₹{order.totalPrice}</span>
                        <div className="order-actions">
                          {status === 'Placed' && (
                            <button className="staff-action-btn blue" disabled={updating === order._id} onClick={() => handleStatusUpdate(order._id, 'Preparing')}>
                              🍳 Start Cooking
                            </button>
                          )}
                          {status === 'Confirmed' && (
                            <button className="staff-action-btn yellow" disabled={updating === order._id} onClick={() => handleStatusUpdate(order._id, 'Preparing')}>
                              🍳 Start Cooking
                            </button>
                          )}
                          {status === 'Preparing' && (
                            <button className="staff-action-btn green" disabled={updating === order._id} onClick={() => handleStatusUpdate(order._id, 'Out for Delivery')}>
                              🛵 Ready to Deliver
                            </button>
                          )}
                          {status === 'Out for Delivery' && (
                            <span style={{ color: '#16A34A', fontWeight: '600', fontSize: '0.8rem' }}>🚀 Out for delivery</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          ))
        )}
      </main>
    </div>
  );
};

export default StaffDashboard;
