import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-page animate-fadeIn">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container text-center">
          <h1 className="about-title animate-slideUp">Our Story</h1>
          <p className="about-subtitle animate-slideUp" style={{animationDelay: '0.2s'}}>
            From a small kitchen in the Himalayas to your plate, we bring you the authentic taste of tradition.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="section bg-primary">
        <div className="container">
          <div className="grid grid-2 align-items-center">
            <div className="about-image-wrapper">
              <img 
                src="https://images.unsplash.com/photo-1541529086526-db283c563270?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Chef making momos" 
                className="about-image"
              />
            </div>
            <div className="about-text">
              <h2 className="mb-4">Handcrafted with Love</h2>
              <p className="mb-4 text-secondary">
                At Momo Cafe, we believe that the best food is made by hand. Our journey started with a simple family recipe passed down through generations. Today, we continue that tradition by folding every single momo by hand, ensuring the perfect dough-to-filling ratio.
              </p>
              <p className="mb-4 text-secondary">
                We source our ingredients locally, partnering with farmers who share our commitment to quality and sustainability. Whether it's the crisp cabbage in our Veg Momos or the succulent chicken in our signature blends, freshness is our guarantee.
              </p>
              <div className="grid grid-2 mt-4 text-center">
                <div className="stat-card p-4 card glass">
                  <h3 className="stat-number">10k+</h3>
                  <p className="text-secondary">Momos Folded</p>
                </div>
                <div className="stat-card p-4 card glass">
                  <h3 className="stat-number">5k+</h3>
                  <p className="text-secondary">Happy Customers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
