import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../../components/ProductCard/ProductCard';
import OffersSlider from '../../components/OffersSlider/OffersSlider';
import { getProducts } from '../../services/api';
import { FiSearch, FiFilter } from 'react-icons/fi';
import './Menu.css';

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('-createdAt');
  
  const location = useLocation();
  const navigate = useNavigate();

  const categories = [
    'All', 'Veg Momo', 'Chicken Momo', 'Fried Momo', 'Steam Momo', 'Paneer Momo', 'Special Momo'
  ];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category') || '';
    const searchQ = params.get('search') || '';
    setCategory(cat);
    setSearch(searchQ);
    fetchProducts(cat, searchQ, sort);
  }, [location.search, sort]);

  const fetchProducts = async (cat, searchQ, sortOpt) => {
    setLoading(true);
    try {
      const params = {};
      if (cat && cat !== 'All') params.category = cat;
      if (searchQ) params.search = searchQ;
      if (sortOpt) params.sort = sortOpt;
      
      const data = await getProducts(params);
      setProducts(data.products);
    } catch (error) {
      console.error('Failed to fetch products', error);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateURL(category, search);
  };

  const handleCategoryClick = (cat) => {
    const newCat = cat === 'All' ? '' : cat;
    setCategory(newCat);
    updateURL(newCat, search);
  };

  const updateURL = (cat, searchQ) => {
    const params = new URLSearchParams();
    if (cat) params.set('category', cat);
    if (searchQ) params.set('search', searchQ);
    navigate(`/menu?${params.toString()}`);
  };

  return (
    <div className="menu-page animate-fadeIn">
      <div className="menu-header">
        <div className="container text-center">
          <h1>Our Menu</h1>
          <p>Discover our delicious varieties of handcrafted momos</p>
        </div>
      </div>

      {/* Offers Sliding Panel */}
      <OffersSlider />

      <div className="container section">
        <div className="menu-controls mb-4">
          <form className="search-bar" onSubmit={handleSearch}>
            <FiSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search momos..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input"
            />
          </form>

          <div className="sort-dropdown">
            <FiFilter className="filter-icon" />
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="select">
              <option value="-createdAt">Newest</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="-rating">Top Rated</option>
            </select>
          </div>
        </div>

        <div className="category-filter mb-4">
          {categories.map((cat) => (
            <button 
              key={cat} 
              className={`cat-pill ${category === cat || (cat === 'All' && !category) ? 'active' : ''}`}
              onClick={() => handleCategoryClick(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-2 grid-3 grid-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: '350px', borderRadius: 'var(--radius-lg)' }}></div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state text-center mt-4">
            <span style={{ fontSize: '4rem' }}>🥟</span>
            <h3>No momos found</h3>
            <p>Try adjusting your search or filters.</p>
            <button className="btn btn-outline mt-4" onClick={() => { setCategory(''); setSearch(''); updateURL('', ''); }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-2 grid-3 grid-4">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
