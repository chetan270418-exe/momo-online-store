import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar/Navbar';
import BottomNav from './components/BottomNav/BottomNav';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Menu from './pages/Menu/Menu';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Cart from './pages/Cart/Cart';
import Checkout from './pages/Checkout/Checkout';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import OrderHistory from './pages/OrderHistory/OrderHistory';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import AdminRoute from './components/AdminRoute/AdminRoute';
import Dashboard from './pages/Admin/Dashboard';
import ManageOrders from './pages/Admin/ManageOrders';
import ManageProducts from './pages/Admin/ManageProducts';
import ManageStaff from './pages/Admin/ManageStaff';
import StaffDashboard from './pages/Staff/StaffDashboard';

import './App.css';

const App = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <AuthProvider>
      <CartProvider>
        <div className="app">
          <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<OrderHistory />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              
              <Route path="/admin" element={<AdminRoute />}>
                <Route index element={<Dashboard />} />
                <Route path="orders" element={<ManageOrders />} />
                <Route path="products" element={<ManageProducts />} />
                <Route path="staff" element={<ManageStaff />} />
                <Route path="*" element={<Dashboard />} />
              </Route>

              {/* Staff Kitchen Panel — completely separate */}
              <Route path="/staff" element={<StaffDashboard />} />

              <Route path="*" element={<div className="container mt-4 text-center"><h2>Page coming soon!</h2></div>} />
            </Routes>
          </main>
          <Footer />
          <BottomNav />
        </div>
        <Toaster position="top-right" />
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
