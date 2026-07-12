import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../../services/api';
import './FoodSlider.css';

// Fallback items shown while loading or if API fails
const FALLBACK = [
  { _id: 'f1', name: 'Classic Veg Momo', price: 120, category: 'Veg Momo',      image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&q=80' },
  { _id: 'f2', name: 'Chicken Momo',     price: 150, category: 'Chicken Momo',  image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80' },
  { _id: 'f3', name: 'Fried Momo',       price: 140, category: 'Fried Momo',    image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&q=80' },
  { _id: 'f4', name: 'Paneer Momo',      price: 160, category: 'Paneer Momo',   image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80' },
  { _id: 'f5', name: 'Jhol Momo',        price: 190, category: 'Special Momo',  image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80' },
  { _id: 'f6', name: 'Steamed Prawn',    price: 220, category: 'Steam Momo',    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&q=80' },
];

const FoodSlider = () => {
  const [products, setProducts] = useState(FALLBACK);
  const navigate = useNavigate();

  useEffect(() => {
    getProducts({ limit: 12 })
      .then(data => {
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
        }
      })
      .catch(() => {}); // keep fallback on error
  }, []);

  // Triplicate for seamless infinite loop
  const items = [...products, ...products, ...products];

  return (
    <section className="food-slider-section">
      <div className="slider-header">
        <span className="slider-badge">🔥 Today's Specials</span>
        <h2 className="slider-title">Our Most Loved Momos</h2>
        <p className="slider-sub">Click any momo to order it instantly</p>
      </div>

      <div className="slider-track-wrapper">
        <div className="slider-fade left" />
        <div className="slider-fade right" />

        <div className="slider-track">
          {items.map((product, idx) => (
            <div
              key={`${product._id}-${idx}`}
              className="slider-card"
              onClick={() => product._id.startsWith('f') ? navigate('/menu') : navigate(`/product/${product._id}`)}
              title={`Order ${product.name}`}
            >
              <div className="slider-img-wrap">
                <img
                  src={product.image}
                  alt={product.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://placehold.co/300x200/8B4513/FFFFFF?text=${encodeURIComponent(product.name)}`;
                  }}
                />
                <span className="slider-price">₹{product.price}</span>
              </div>
              <div className="slider-info">
                <p className="slider-name">{product.name}</p>
                <span className="slider-cat">{product.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FoodSlider;
