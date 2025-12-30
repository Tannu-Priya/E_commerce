import { useNavigate } from 'react-router-dom';
import { useWishlist } from './components/context/WishlistContext';
import { useCart } from './components/context/CartContext';
import { useToast } from './components/Toast';
import { Heart, X, ShoppingBag, ShoppingCart } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BASE_URL = API_URL.replace('/api', '');

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleRemove = (productId) => {
    removeFromWishlist(productId);
    showToast('Removed from wishlist', 'info');
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    showToast('Added to cart!', 'success');
  };

  const handleMoveToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product._id || product.id);
    showToast('Moved to cart!', 'success');
  };

  if (wishlist.length === 0) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--light-bg)',
        padding: '120px 2rem 4rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          textAlign: 'center',
          maxWidth: '600px'
        }}>
          <div style={{
            marginBottom: '2rem',
            animation: 'float 3s ease-in-out infinite',
            color: 'var(--primary-maroon)',
            display: 'flex',
            justifyContent: 'center'
          }}>
            <Heart size={120} strokeWidth={1} />
          </div>
          <h1 style={{
            fontFamily: 'Playfair Display',
            fontSize: '3rem',
            color: 'var(--primary-maroon)',
            marginBottom: '1rem'
          }}>
            Your Wishlist is Empty
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: '#666',
            marginBottom: '3rem',
            lineHeight: '1.8'
          }}>
            Start adding products you love to your wishlist and they'll appear here!
          </p>
          <button
            onClick={() => navigate('/products')}
            style={{
              padding: '1.2rem 3rem',
              background: 'linear-gradient(135deg, var(--primary-maroon) 0%, var(--primary-red) 100%)',
              color: 'var(--accent-gold)',
              border: '2px solid var(--accent-gold)',
              borderRadius: '50px',
              fontSize: '1.1rem',
              fontWeight: '700',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(128, 0, 32, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 6px 20px rgba(128, 0, 32, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(128, 0, 32, 0.3)';
            }}
          >
            Browse Products
          </button>
        </div>
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--light-bg)',
      padding: '120px 2rem 4rem'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '4rem'
        }}>
          <h1 style={{
            fontFamily: 'Playfair Display',
            fontSize: '3.5rem',
            color: 'var(--primary-maroon)',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem'
          }}>
            <Heart size={48} fill="var(--primary-maroon)" />
            My Wishlist
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: '#666'
          }}>
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>

        {/* Wishlist Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {wishlist.map((product) => (
            <div
              key={product._id || product.id}
              style={{
                background: 'white',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
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
              {/* Remove Button */}
              <button
                onClick={() => handleRemove(product._id || product.id)}
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
                  fontSize: '1.2rem',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                  transition: 'all 0.3s ease',
                  zIndex: 10
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.1) rotate(90deg)';
                  e.target.style.background = '#f44336';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1) rotate(0deg)';
                  e.target.style.background = 'white';
                }}
              >
                <X size={20} />
              </button>

              {/* Product Image */}
              <div
                onClick={() => navigate(`/product/${product._id || product.id}`)}
                style={{
                  height: '350px',
                  background: 'var(--cream-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  cursor: 'pointer'
                }}
              >
                {product.image && product.image !== '/images/products/default.jpg' ? (
                  <img
                    src={product.image.startsWith('http')
                      ? product.image
                      : `${BASE_URL}${encodeURI(product.image)}`
                    }
                    alt={product.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  />
                ) : (
                  <span style={{ color: '#e8d5c4' }}><ShoppingBag size={64} strokeWidth={1} /></span>
                )}
              </div>

              {/* Product Info */}
              <div style={{ padding: '1.5rem' }}>
                <h3
                  onClick={() => navigate(`/product/${product._id || product.id}`)}
                  style={{
                    fontFamily: 'Playfair Display',
                    fontSize: '1.5rem',
                    color: 'var(--primary-maroon)',
                    marginBottom: '0.5rem',
                    cursor: 'pointer',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--accent-gold)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--primary-maroon)'}
                >
                  {product.name}
                </h3>

                <p style={{
                  color: '#666',
                  fontSize: '0.95rem',
                  marginBottom: '1rem',
                  lineHeight: '1.6',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {product.description || 'Exquisite ethnic wear'}
                </p>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem'
                }}>
                  <span style={{
                    fontFamily: 'Playfair Display',
                    fontSize: '1.8rem',
                    fontWeight: '700',
                    color: 'var(--primary-maroon)'
                  }}>
                    ₹{product.price}
                  </span>
                  {product.stock > 0 ? (
                    <span style={{
                      padding: '0.5rem 1rem',
                      background: '#e8f5e9',
                      color: '#2e7d32',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: '600'
                    }}>
                      In Stock
                    </span>
                  ) : (
                    <span style={{
                      padding: '0.5rem 1rem',
                      background: '#ffebee',
                      color: '#c62828',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: '600'
                    }}>
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div style={{
                  display: 'flex',
                  gap: '0.75rem'
                }}>
                  <button
                    onClick={() => handleMoveToCart(product)}
                    disabled={product.stock === 0}
                    style={{
                      flex: 1,
                      padding: '0.9rem',
                      background: product.stock === 0
                        ? '#ccc'
                        : 'linear-gradient(135deg, var(--primary-maroon) 0%, var(--primary-red) 100%)',
                      color: 'var(--accent-gold)',
                      border: '2px solid var(--accent-gold)',
                      borderRadius: '50px',
                      fontSize: '0.9rem',
                      fontWeight: '700',
                      cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (product.stock > 0) {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 4px 15px rgba(128, 0, 32, 0.3)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (product.stock > 0) {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }
                    }}
                  >
                    Move to Cart
                  </button>

                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                    style={{
                      padding: '0.9rem 1.5rem',
                      background: 'white',
                      color: 'var(--primary-maroon)',
                      border: '2px solid var(--primary-maroon)',
                      borderRadius: '50px',
                      fontSize: '0.9rem',
                      fontWeight: '700',
                      cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (product.stock > 0) {
                        e.target.style.background = 'var(--primary-maroon)';
                        e.target.style.color = 'var(--accent-gold)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (product.stock > 0) {
                        e.target.style.background = 'white';
                        e.target.style.color = 'var(--primary-maroon)';
                      }
                    }}
                  >
                    <ShoppingCart size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Shopping Button */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => navigate('/products')}
            style={{
              padding: '1rem 3rem',
              background: 'white',
              color: 'var(--primary-maroon)',
              border: '2px solid var(--primary-maroon)',
              borderRadius: '50px',
              fontSize: '1rem',
              fontWeight: '700',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'var(--primary-maroon)';
              e.target.style.color = 'var(--accent-gold)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'white';
              e.target.style.color = 'var(--primary-maroon)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
