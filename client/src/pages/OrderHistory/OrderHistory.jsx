import React, { useState, useEffect } from 'react';
import { getMyOrders } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FiPackage, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import './OrderHistory.css';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const data = await getMyOrders(1);
        setOrders(data.orders);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    fetchOrders();
  }, [isAuthenticated, navigate]);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Delivered': return <FiCheckCircle className="text-success" />;
      case 'Cancelled': return <FiXCircle className="text-danger" />;
      default: return <FiClock className="text-warning" />;
    }
  };

  if (loading) {
    return <div className="container section text-center">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="container section text-center animate-fadeIn">
        <div className="empty-orders mb-4">
          <FiPackage size={64} className="text-light" />
        </div>
        <h2 className="mb-4">No Orders Yet</h2>
        <p className="mb-4 text-secondary">You haven't placed any orders yet. Let's fix that!</p>
        <Link to="/menu" className="btn btn-primary btn-lg">Order Some Momos</Link>
      </div>
    );
  }

  return (
    <div className="order-history-page container section animate-fadeIn">
      <h1 className="mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Order History</h1>
      
      <div className="orders-list grid">
        {orders.map(order => (
          <div key={order._id} className="order-card card p-4">
            <div className="order-header flex-between mb-4">
              <div>
                <span className="text-secondary text-sm">Order #{order._id.substring(18)}</span>
                <div className="order-date font-weight-500">
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </div>
              </div>
              <div className="order-status-badge">
                {getStatusIcon(order.status)} <span className={`status-${order.status.toLowerCase().replace(' ', '-')}`}>{order.status}</span>
              </div>
            </div>
            
            <hr className="divider mb-4" />
            
            <div className="order-items mb-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="order-item flex-between mb-2">
                  <span className="text-secondary">{item.quantity}x {item.name}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            
            <hr className="divider mb-4" />
            
            <div className="order-footer flex-between">
              <span className="text-secondary">Total Amount</span>
              <span className="order-total-price">₹{order.totalPrice}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
