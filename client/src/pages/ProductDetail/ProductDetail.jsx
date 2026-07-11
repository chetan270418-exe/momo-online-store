import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiStar, FiArrowLeft, FiClock, FiShield } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { getProductById } from '../../services/api';
import toast from 'react-hot-toast';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data.product);
      } catch (error) {
        toast.error('Failed to load product details');
        navigate('/menu');
      }
      setLoading(false);
    };
    
    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    try {
      await addToCart(product, quantity);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  if (loading) {
    return (
      <div className="container section text-center" style={{ minHeight: '60vh', paddingTop: '150px' }}>
        <div className="spinner"></div>
        <p className="mt-4">Loading fresh momos...</p>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="product-detail-page container section animate-fadeIn">
      <button className="back-btn mb-4" onClick={() => navigate('/menu')}>
        <FiArrowLeft /> Back to Menu
      </button>
      
      <div className="detail-layout card glass">
        <div className="detail-img-section">
          <img src={product.image} alt={product.name} className="detail-img" />
          <span className="badge category-badge-lg">{product.category}</span>
        </div>
        
        <div className="detail-info-section">
          <h1 className="detail-title">{product.name}</h1>
          
          <div className="detail-meta mb-4">
            <div className="rating-pill">
              <FiStar className="star-icon" />
              <span>{product.rating} ({product.numReviews} Reviews)</span>
            </div>
            <div className="status-pill text-secondary">
              <FiShield /> {product.isAvailable ? 'In Stock' : 'Out of Stock'}
            </div>
          </div>
          
          <h2 className="detail-price mb-4">₹{product.price}</h2>
          
          <div className="detail-description mb-4">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>
          
          <div className="detail-features mb-4 grid grid-2">
            <div className="feature">
              <span className="feature-icon">🥟</span>
              <span>Handcrafted Daily</span>
            </div>
            <div className="feature">
              <FiClock className="feature-icon" />
              <span>15 Min Prep Time</span>
            </div>
          </div>
          
          <hr className="divider mb-4" />
          
          <div className="add-to-cart-section">
            <div className="quantity-selector">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="qty-btn">-</button>
              <span className="qty-value">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="qty-btn">+</button>
            </div>
            
            <button 
              className="btn btn-primary btn-lg flex-1 ml-4"
              onClick={handleAddToCart}
              disabled={!product.isAvailable || product.stock === 0}
            >
              <FiShoppingCart /> Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section mt-4">
        <h2 className="mb-4" style={{fontFamily: 'var(--font-heading)'}}>Customer Reviews</h2>
        {product.reviews && product.reviews.length > 0 ? (
          <div className="grid grid-2">
            {product.reviews.map(review => (
              <div key={review._id} className="review-card card p-4">
                <div className="flex-between mb-2">
                  <strong>{review.name}</strong>
                  <div className="text-secondary"><FiStar className="star-icon" /> {review.rating}</div>
                </div>
                <p className="text-secondary">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-secondary">No reviews yet. Be the first to review!</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
