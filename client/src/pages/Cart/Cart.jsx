import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiArrowRight } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="cart-page container section animate-fadeIn">
        <div className="empty-cart text-center card">
          <div className="empty-cart-icon">🥟</div>
          <h2>Your cart is empty</h2>
          <p className="mb-4">Looks like you haven't added any delicious momos yet.</p>
          <Link to="/menu" className="btn btn-primary btn-lg">Explore Menu</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page container section animate-fadeIn">
      <h1 className="mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Your Cart</h1>
      
      <div className="cart-layout">
        <div className="cart-items-section">
          <div className="cart-items-header">
            <span>Product</span>
            <span>Quantity</span>
            <span>Total</span>
          </div>
          
          <div className="cart-items">
            {cartItems.map((item) => {
              const product = item.product;
              return (
                <div key={product._id} className="cart-item card">
                  <div className="cart-item-product">
                    <img src={product.image} alt={product.name} className="cart-item-img" />
                    <div>
                      <h3><Link to={`/product/${product._id}`}>{product.name}</Link></h3>
                      <p className="text-secondary">₹{product.price}</p>
                    </div>
                  </div>
                  
                  <div className="cart-item-quantity">
                    <button onClick={() => updateQuantity(product, Math.max(1, item.quantity - 1))} className="qty-btn">
                      <FiMinus />
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button onClick={() => updateQuantity(product, item.quantity + 1)} className="qty-btn">
                      <FiPlus />
                    </button>
                  </div>
                  
                  <div className="cart-item-total">
                    <strong>₹{product.price * item.quantity}</strong>
                    <button onClick={() => removeFromCart(product._id)} className="remove-btn" title="Remove">
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="cart-actions mt-4">
            <button onClick={clearCart} className="btn btn-outline btn-sm">Clear Cart</button>
            <Link to="/menu" className="btn btn-secondary btn-sm">Continue Shopping</Link>
          </div>
        </div>
        
        <div className="cart-summary-section">
          <div className="card summary-card glass">
            <h2 className="mb-4">Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{cartTotal}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Fee</span>
              <span>{cartTotal > 500 ? 'Free' : '₹50'}</span>
            </div>
            <div className="summary-row">
              <span>Tax (5%)</span>
              <span>₹{(cartTotal * 0.05).toFixed(2)}</span>
            </div>
            
            <hr className="summary-divider" />
            
            <div className="summary-row summary-total">
              <span>Total</span>
              <span>₹{(cartTotal + (cartTotal > 500 ? 0 : 50) + cartTotal * 0.05).toFixed(2)}</span>
            </div>
            
            <button 
              className="btn btn-primary w-100 btn-lg mt-4 checkout-btn"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout <FiArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
