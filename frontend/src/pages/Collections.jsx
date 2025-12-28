import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from './components/context/CartContext';
import { useWishlist } from './components/context/WishlistContext';
import { useToast } from './components/Toast';
import { ShoppingBag, Star, Heart, Sliders, X, Search, Filter } from 'lucide-react';
import { Shirt, Layers } from 'lucide-react'; // Imports for category icons if not already present.
// Consolidated imports:
import {
  ShoppingBag as ShoppingBagIcon,
  Shirt as ShirtIcon,
  Layers as LayersIcon,
  ShoppingCart
} from 'lucide-react';

export default function Collections() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchQuery, selectedCategory, priceRange, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      showToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category?.toLowerCase() === selectedCategory);
    }

    // Price filter
    if (priceRange !== 'all') {
      const ranges = {
        '0-1000': [0, 1000],
        '1000-2000': [1000, 2000],
        '2000-3000': [2000, 3000],
        '3000-5000': [3000, 5000],
        '5000+': [5000, Infinity]
      };
      const [min, max] = ranges[priceRange];
      filtered = filtered.filter(p => p.price >= min && p.price <= max);
    }

    // Sort
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredProducts(filtered);
  };

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    if (product.stock > 0) {
      addToCart(product);
      showToast('Added to cart!', 'success');
    }
  };

  const handleWishlistToggle = (product, e) => {
    e.stopPropagation();
    const added = toggleWishlist(product);
    showToast(added ? 'Added to wishlist!' : 'Removed from wishlist', added ? 'success' : 'info');
  };

  const categories = [
    { id: 'all', name: 'All Products', icon: <ShoppingBagIcon size={20} /> },
    { id: 'saree', name: 'Sarees', icon: <LayersIcon size={20} /> },
    { id: 'kurti', name: 'Kurtis', icon: <ShirtIcon size={20} /> },
    { id: 'lehenga', name: 'Lehengas', icon: <ShoppingBagIcon size={20} /> } // Using ShoppingBag as placeholder or another suitable icon if available
  ];

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#faf8f5' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '1rem', animation: 'spin 1s linear infinite', display: 'flex', justifyContent: 'center', color: '#d4af37' }}><Star size={64} fill="#d4af37" /></div>
          <p style={{ fontSize: '1.5rem', color: 'var(--primary-maroon)' }}>Loading Collections...</p>
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#faf8f5', paddingTop: '100px' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--primary-maroon) 0%, var(--primary-red) 100%)', padding: '3rem 2rem', textAlign: 'center', color: 'white' }}>
        <h1 style={{ fontFamily: 'Playfair Display', fontSize: '3.5rem', marginBottom: '1rem', color: 'var(--accent-gold)' }}>
          Our Collections
        </h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.95 }}>
          Discover {filteredProducts.length} exquisite pieces of ethnic wear
        </p>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        {/* Search and Filter Bar */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Search */}
            <div style={{ flex: '1', minWidth: '250px' }}>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.9rem 1.2rem',
                  border: '2px solid #e8d5c4',
                  borderRadius: '50px',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.3s'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent-gold)'}
                onBlur={(e) => e.target.style.borderColor = '#e8d5c4'}
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '0.9rem 1.2rem',
                border: '2px solid #e8d5c4',
                borderRadius: '50px',
                fontSize: '1rem',
                background: 'white',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{
                padding: '0.9rem 2rem',
                background: showFilters ? 'linear-gradient(135deg, var(--primary-maroon) 0%, var(--primary-red) 100%)' : 'white',
                color: showFilters ? 'var(--accent-gold)' : 'var(--primary-maroon)',
                border: '2px solid var(--primary-maroon)',
                borderRadius: '50px',
                fontSize: '1rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >

              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {showFilters ? <><X size={16} /> Filters</> : <><Sliders size={16} /> Filters</>}
              </span>
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '2px solid #e8d5c4' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                {/* Price Range Dropdown */}
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.8rem', fontWeight: '700', color: 'var(--primary-maroon)', fontSize: '1rem' }}>
                    <ShoppingBagIcon size={20} /> Price Range
                  </label>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.9rem 1.2rem',
                      border: '2px solid #e8d5c4',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      background: 'white',
                      cursor: 'pointer',
                      outline: 'none',
                      fontWeight: '600',
                      color: 'var(--primary-maroon)',
                      transition: 'all 0.3s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--accent-gold)'}
                    onBlur={(e) => e.target.style.borderColor = '#e8d5c4'}
                  >
                    <option value="all">All Prices</option>
                    <option value="0-1000">₹0 - ₹1,000</option>
                    <option value="1000-2000">₹1,000 - ₹2,000</option>
                    <option value="2000-3000">₹2,000 - ₹3,000</option>
                    <option value="3000-5000">₹3,000 - ₹5,000</option>
                    <option value="5000+">₹5,000+</option>
                  </select>
                </div>

                {/* Clear Filters Button */}
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setPriceRange('all');
                      setSortBy('newest');
                    }}
                    style={{
                      width: '100%',
                      padding: '0.9rem 1.2rem',
                      background: 'linear-gradient(135deg, #f5f0e8 0%, #e8d5c4 100%)',
                      color: 'var(--primary-maroon)',
                      border: '2px solid #e8d5c4',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, var(--primary-maroon) 0%, var(--primary-red) 100%)';
                      e.target.style.color = 'var(--accent-gold)';
                      e.target.style.borderColor = 'var(--accent-gold)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, #f5f0e8 0%, #e8d5c4 100%)';
                      e.target.style.color = 'var(--primary-maroon)';
                      e.target.style.borderColor = '#e8d5c4';
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}><X size={16} /> Clear All Filters</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Category Tabs */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: '1rem 2rem',
                background: selectedCategory === cat.id ? 'linear-gradient(135deg, var(--primary-maroon) 0%, var(--primary-red) 100%)' : 'white',
                color: selectedCategory === cat.id ? 'var(--accent-gold)' : 'var(--primary-maroon)',
                border: '2px solid var(--primary-maroon)',
                borderRadius: '50px',
                fontSize: '1rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center', color: '#666' }}><Search size={80} /></div>
            <h2 style={{ fontFamily: 'Playfair Display', fontSize: '2rem', color: 'var(--primary-maroon)', marginBottom: '0.5rem' }}>
              No products found
            </h2>
            <p style={{ color: '#666', fontSize: '1.1rem' }}>Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {filteredProducts.map(product => (
              <div
                key={product._id}
                onClick={() => navigate(`/product/${product._id}`)}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(128, 0, 32, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                }}
              >
                {/* Image */}
                <div style={{ position: 'relative', height: '300px', overflow: 'hidden' }}>
                  <img
                    src={product.image 
                      ? product.image.startsWith('http') 
                        ? product.image 
                        : `http://localhost:5000${encodeURI(product.image)}`
                      : 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&h=700&fit=crop'
                    }
                    alt={product.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      opacity: product.stock === 0 ? 0.5 : 1
                    }}
                  />

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => handleWishlistToggle(product, e)}
                    style={{
                      position: 'absolute',
                      top: '15px',
                      right: '15px',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.3rem',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                      zIndex: 10
                    }}
                  >
                    {isInWishlist(product._id) ? <Heart size={20} fill="#dc3545" color="#dc3545" /> : <Heart size={20} />}
                  </button>

                  {/* Stock Badge */}
                  {product.stock !== undefined && (
                    <div style={{
                      position: 'absolute',
                      top: '15px',
                      left: '15px',
                      padding: '6px 12px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      background: product.stock === 0 ? '#ffebee' : product.stock < 5 ? '#fff3cd' : '#e8f5e9',
                      color: product.stock === 0 ? '#c62828' : product.stock < 5 ? '#f57c00' : '#2e7d32'
                    }}>
                      {product.stock === 0 ? 'Out of Stock' : `${product.stock} left`}
                    </div>
                  )}

                  {product.stock === 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      background: 'rgba(0, 0, 0, 0.85)',
                      color: 'white',
                      padding: '0.8rem 1.5rem',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontWeight: '700',
                      border: '2px solid #f44336'
                    }}>
                      OUT OF STOCK
                    </div>
                  )}
                </div>

                {/* Content */}
                <div style={{ padding: '1.2rem' }}>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent-gold)', fontWeight: '700', marginBottom: '0.5rem' }}>
                    {product.category}
                  </div>
                  <h3 style={{ fontFamily: 'Playfair Display', fontSize: '1.2rem', color: 'var(--primary-maroon)', marginBottom: '0.5rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {product.name}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem', height: '2.5rem', overflow: 'hidden' }}>
                    {product.description}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'Playfair Display', fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary-maroon)' }}>
                      ₹{product.price}
                    </span>
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      disabled={product.stock === 0}
                      style={{
                        padding: '0.6rem 1.2rem',
                        background: product.stock === 0 ? '#ccc' : 'linear-gradient(135deg, var(--primary-maroon) 0%, var(--primary-red) 100%)',
                        color: product.stock === 0 ? '#666' : 'var(--accent-gold)',
                        border: 'none',
                        borderRadius: '50px',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                        transition: 'all 0.3s'
                      }}
                    >
                      {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


