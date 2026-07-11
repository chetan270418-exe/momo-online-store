import React, { useState } from 'react';
import { FiMapPin, FiPhone, FiMail, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate sending email
    toast.success('Message sent successfully! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="contact-page animate-fadeIn">
      <div className="contact-header">
        <div className="container text-center">
          <h1 className="animate-slideUp">Contact Us</h1>
          <p className="animate-slideUp" style={{animationDelay: '0.2s'}}>We'd love to hear from you. Drop us a line!</p>
        </div>
      </div>

      <div className="container section">
        <div className="grid grid-2">
          <div className="contact-info-section">
            <h2 className="mb-4">Get in Touch</h2>
            <p className="text-secondary mb-4">
              Whether you have a question about our menu, delivery options, or just want to say hello, we are always ready to answer your questions.
            </p>
            
            <div className="contact-details mt-4">
              <div className="contact-item">
                <div className="icon-wrapper"><FiMapPin /></div>
                <div>
                  <h3>Our Location</h3>
                  <p className="text-secondary">123 Momo Street, Food City, FC 12345</p>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="icon-wrapper"><FiPhone /></div>
                <div>
                  <h3>Phone Number</h3>
                  <p className="text-secondary">+91 98765 43210</p>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="icon-wrapper"><FiMail /></div>
                <div>
                  <h3>Email Address</h3>
                  <p className="text-secondary">hello@momocafe.com</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="contact-form-section">
            <form onSubmit={handleSubmit} className="card glass p-4 contact-form">
              <h2 className="mb-4">Send us a Message</h2>
              
              <div className="form-group">
                <label>Your Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="input" placeholder="John Doe" />
              </div>
              
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="input" placeholder="you@example.com" />
              </div>
              
              <div className="form-group">
                <label>Subject</label>
                <input type="text" name="subject" value={formData.subject} onChange={handleChange} required className="input" placeholder="How can we help?" />
              </div>
              
              <div className="form-group">
                <label>Message</label>
                <textarea name="message" value={formData.message} onChange={handleChange} required className="textarea" rows="5" placeholder="Write your message here..."></textarea>
              </div>
              
              <button type="submit" className="btn btn-primary w-100">
                <FiSend /> Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
