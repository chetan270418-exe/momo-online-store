import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../../services/api';
import './OffersSlider.css';

// Fallback items shown while loading or if API fails

const FALLBACK = [
  { _id: 'o1', name: 'Classic Veg Momo',   price: 120, category: 'Veg Momo',     image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&q=80', offer: { isActive: true, label: '20% OFF', discount: 20, color: '#EF4444' } },
  { _id: 'o2', name: 'Chicken Momo',       price: 150, category: 'Chicken Momo', image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80', offer: { isActive: true, label: 'MEAL DEAL', discount: 15, color: '#8B5CF6' } },
  { _id: 'o3', name: 'Crispy Fried Momo',  price: 140, category: 'Fried Momo',   image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&q=80', offer: { isActive: true, label: 'BUY 2 GET 1', discount: 0, color: '#0EA5E9' } },
  { _id: 'o4', name: 'Paneer Tikka Momo',  price: 160, category: 'Paneer Momo',  image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80', offer: { isActive: true, label: '15% OFF', discount: 15, color: '#F59E0B' } },
  { _id: 'o5', name: 'Jhol Momo Special',  price: 190, category: 'Special Momo', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80', offer: { isActive: true, label: 'COMBO DEAL', discount: 10, color: '#10B981' } },
  { _id: 'o6', name: 'Steamed Prawn Momo', price: 220, category: 'Steam Momo',   image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&q=80', offer: { isActive: true, label: 'HAPPY HOUR', discount: 25, color: '#EC4899' } },
];

const OffersSlider = () => {
  const [products, setProducts] = useState(FALLBACK);
  const navigate = useNavigate();

  useEffect(() => {
    getProducts({ limit: 100 })
      .then(data => {
        if (data.products && data.products.length > 0) {
          const withActiveOffers = data.products.filter(p => p.offer && p.offer.isActive);
          if (withActiveOffers.length > 0) {
            setProducts(withActiveOffers);
          }
        }
      })
      .catch(() => {});
  }, []);

  // Triplicate for seamless infinite loop
  const items = [...products, ...products, ...products];

  return (
    <div className="offers-slider-wrapper">
      {/* Header banner */}
      <div className="offers-banner">
        <div className="offers-banner-inner">
          <span className="offers-fire">🔥</span>
          <span className="offers-headline">LIMITED TIME DEALS &amp; OFFERS</span>
          <span className="offers-fire">🔥</span>
        </div>
      </div>

      {/* Scrolling track */}
      <div className="offers-track-wrapper">
        <div className="offers-fade left" />
        <div className="offers-fade right" />

        <div className="offers-track">
          {items.map((product, idx) => {
            const discountedPrice = product.offer.discount > 0
              ? Math.round(product.price * (1 - product.offer.discount / 100))
              : null;

            return (
              <div
                key={`${product._id}-${idx}`}
                className="offer-card"
                onClick={() => product._id.startsWith('o') ? navigate('/menu') : navigate(`/product/${product._id}`)}
              >
                {/* Offer badge */}
                {product.offer && product.offer.isActive && (
                  <div
                    className="offer-badge"
                    style={{ background: product.offer.color || '#EF4444' }}
                  >
                    {product.offer.label}
                  </div>
                )}

                {/* Image */}
                <div className="offer-img-wrap">
                  <img
                    src={product.image}
                    alt={product.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://placehold.co/280x180/8B4513/FFF?text=${encodeURIComponent(product.name)}`;
                    }}
                  />
                </div>

                {/* Info */}
                <div className="offer-info" style={{ borderTop: `3px solid ${product.offer?.color || '#EF4444'}` }}>
                  <p className="offer-name">{product.name}</p>
                  <span className="offer-cat">{product.category}</span>
                  <div className="offer-pricing">
                    {discountedPrice ? (
                      <>
                        <span className="offer-original">₹{product.price}</span>
                        <span className="offer-discounted">₹{discountedPrice}</span>
                      </>
                    ) : (
                      <span className="offer-discounted">₹{product.price}</span>
                    )}
                  </div>
                  <button
                    className="offer-order-btn"
                    style={{ background: product.offer?.color || '#EF4444' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      product._id.startsWith('o') ? navigate('/menu') : navigate(`/product/${product._id}`);
                    }}
                  >
                    Grab This Deal →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OffersSlider;
