import React from 'react';
import { FiShoppingCart, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import FoodSlider from '../../components/FoodSlider/FoodSlider';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page animate-fadeIn">
      {/* Hero Section */}
      <section className="hero">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="hero-video"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="hero-overlay"></div>
        <div className="container hero-container">
          <div className="hero-content text-center">
            <h1 className="hero-title animate-slideUp">
              Fresh & Artisanal Momos
            </h1>
            <p className="hero-subtitle animate-slideUp" style={{animationDelay: '0.2s'}}>
              Experience the authentic taste of the Himalayas, handcrafted with love and steamed to perfection in our cozy cafe.
            </p>
            <div className="hero-buttons animate-slideUp" style={{animationDelay: '0.4s'}}>
              <Link to="/menu" className="btn btn-primary btn-lg">
                Order Now <FiShoppingCart />
              </Link>
              <Link to="/menu" className="btn btn-outline btn-lg glass">
                Explore Menu
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="section featured-section">
        <div className="container text-center">
          <h2 className="section-title">A Taste of Tradition</h2>
          <p className="section-subtitle mb-4">Made fresh daily with locally sourced ingredients.</p>
          <div className="grid grid-3 text-center steps">
            <div className="step card">
              <div className="step-icon">🥟</div>
              <h3>Handcrafted</h3>
              <p>Every momo is carefully folded by our expert chefs.</p>
            </div>
            <div className="step card">
              <div className="step-icon">🌿</div>
              <h3>Fresh Ingredients</h3>
              <p>We use only the freshest produce and premium meats.</p>
            </div>
            <div className="step card">
              <div className="step-icon">♨️</div>
              <h3>Steamed to Perfection</h3>
              <p>Served piping hot with our signature spicy dipping sauces.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Food Slider — Specials Marquee */}
      <FoodSlider />

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="container text-center">
          <h2>Ready for a bite?</h2>
          <p>Order online and enjoy the cafe experience at home.</p>
          <Link to="/menu" className="btn btn-primary btn-lg mt-4">
            View Full Menu <FiArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
