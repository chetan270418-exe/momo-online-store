import React from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiPhone, FiMail, FiInstagram, FiFacebook, FiTwitter } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <h3 className="footer-logo">🥟 MomoHub</h3>
            <p className="footer-desc">
              Serving the most authentic, fresh, and delicious momos in town. 
              Handcrafted with love and premium ingredients.
            </p>
          </div>
          
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/menu">Our Menu</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contact Info</h4>
            <ul className="contact-info">
              <li><FiMapPin /> 123 Momo Street, Food City</li>
              <li><FiPhone /> +91 98765 43210</li>
              <li><FiMail /> hello@momohub.com</li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Newsletter</h4>
            <p>Subscribe for exclusive deals!</p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Your Email" className="input" />
              <button type="submit" className="btn btn-primary">Subscribe</button>
            </form>
            <div className="social-links mt-4">
              <a href="#"><FiInstagram /></a>
              <a href="#"><FiFacebook /></a>
              <a href="#"><FiTwitter /></a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} MomoHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
