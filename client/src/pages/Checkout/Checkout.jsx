import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { createOrder } from '../../services/api';
import toast from 'react-hot-toast';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zip: user?.address?.zip || '',
    phone: user?.phone || '',
    paymentMethod: 'Cash on Delivery'
  });

  const [loading, setLoading] = useState(false);

  if (authLoading) {
    return <div className="container section text-center">Loading checkout...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (cartItems.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const orderData = {
        deliveryAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          phone: formData.phone
        },
        paymentMethod: formData.paymentMethod
      };
      
      const res = await createOrder(orderData);
      await clearCart();
      toast.success('Order placed successfully!');
      navigate('/orders'); // Redirect to order history
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    }
    setLoading(false);
  };

  const deliveryFee = cartTotal > 500 ? 0 : 50;
  const tax = cartTotal * 0.05;
  const finalTotal = cartTotal + deliveryFee + tax;

  return (
    <div className="checkout-page container section animate-fadeIn">
      <h1 className="mb-4">Checkout</h1>
      
      <div className="checkout-layout">
        <div className="checkout-form-section">
          <form onSubmit={handleSubmit} className="card glass p-4">
            <h2 className="mb-4">Delivery Address</h2>
            
            <div className="form-group">
              <label>Phone Number</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} required className="input" />
            </div>
            
            <div className="form-group">
              <label>Street Address</label>
              <input type="text" name="street" value={formData.street} onChange={handleChange} required className="input" />
            </div>
            
            <div className="grid grid-2">
              <div className="form-group">
                <label>City</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} required className="input" />
              </div>
              <div className="form-group">
                <label>State</label>
                <input type="text" name="state" value={formData.state} onChange={handleChange} required className="input" />
              </div>
            </div>
            
            <div className="form-group">
              <label>ZIP / Postal Code</label>
              <input type="text" name="zip" value={formData.zip} onChange={handleChange} required className="input" />
            </div>
            
            <h2 className="mt-4 mb-4">Payment Method</h2>
            <div className="form-group">
              <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="select">
                <option value="Cash on Delivery">Cash on Delivery</option>
                <option value="Online Payment">Online Payment (Coming Soon)</option>
              </select>
            </div>
            
            <button type="submit" className="btn btn-primary w-100 btn-lg mt-4" disabled={loading || formData.paymentMethod === 'Online Payment'}>
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>
        
        <div className="checkout-summary-section">
          <div className="card glass p-4">
            <h2 className="mb-4">Order Summary</h2>
            <div className="checkout-items mb-4">
              {cartItems.map(item => (
                <div key={item.product._id} className="checkout-item">
                  <span>{item.quantity} x {item.product.name}</span>
                  <span>₹{item.product.price * item.quantity}</span>
                </div>
              ))}
            </div>
            
            <hr className="mb-4" style={{border: 'none', borderTop: '1px dashed var(--border)'}} />
            
            <div className="checkout-totals">
              <div className="flex-between mb-2 text-secondary">
                <span>Subtotal</span>
                <span>₹{cartTotal}</span>
              </div>
              <div className="flex-between mb-2 text-secondary">
                <span>Delivery</span>
                <span>{deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}</span>
              </div>
              <div className="flex-between mb-2 text-secondary">
                <span>Tax (5%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              
              <div className="flex-between mt-4" style={{fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-dark)', fontFamily: 'var(--font-heading)'}}>
                <span>Total</span>
                <span>₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
