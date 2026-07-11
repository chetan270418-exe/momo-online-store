import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiStar } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart(product, 1);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Veg Momo': return 'badge-success';
      case 'Chicken Momo': return 'badge-danger';
      case 'Fried Momo': return 'badge-warning';
      case 'Steam Momo': return 'badge-info';
      default: return 'badge-success';
    }
  };

  return (
    <div className="card product-card animate-fadeIn" onClick={() => navigate(`/product/${product._id}`)}>
      <div className="product-img-wrapper">
        <span className={`badge category-badge ${getCategoryColor(product.category)}`}>
          {product.category}
        </span>
        <img 
          src={product.image || 'https://placehold.co/400x300/8B4513/FFFFFF?text=🥟+Momo'} 
          alt={product.name} 
          className="product-img"
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x300/8B4513/FFFFFF?text=🥟+Momo'; }}
        />
      </div>
      <div className="product-info">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-desc">{product.description}</p>
        
        <div className="product-meta">
          <div className="product-rating">
            <FiStar className="star-icon" />
            <span>{product.rating} ({product.numReviews})</span>
          </div>
          <span className="product-price">₹{product.price}</span>
        </div>

        <button 
          className="btn btn-primary w-100 add-to-cart-btn" 
          onClick={handleAddToCart}
          disabled={!product.isAvailable || product.stock === 0}
        >
          <FiShoppingCart /> 
          {product.isAvailable && product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
