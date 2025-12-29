import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Shirt, Layers, Star, Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import video from "../assets/Promotional_Video_for_Thread_Story.mp4";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();
      // Get first 4 products as featured
      setFeaturedProducts(data.slice(0, 4));
    } catch (error) {
      console.error('Error fetching featured products:', error);
      setFeaturedProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative', zIndex: 3 }}>
      {/* Hero Section */}
      <div style={{
  position: 'relative',
  padding: '120px 2rem 80px',
  textAlign: 'center',
  color: 'white',
  overflow: 'hidden'
}}>


{/* Background Video */}
<video
  src={video}
  autoPlay
  loop
  muted
  playsInline
  style={{
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: 1
  }}
/>

{/* Dark Overlay */}
<div style={{
  position: 'absolute',
  inset: 0,
  //background: 'linear-gradient(135deg, rgba(128,0,32,0.7), rgba(179,0,0,0.7))',
  zIndex: 2
}} />




        <h1 style={{
          fontFamily: 'Playfair Display',
          fontSize: '4rem',
          marginBottom: '1.5rem',
          color: 'var(--accent-gold)',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          Thread Story
        </h1>
        <p style={{
          fontSize: '1.5rem',
          marginBottom: '3rem',
          opacity: 0.95,
          maxWidth: '600px',
          margin: '0 auto 3rem'
        }}>
          Discover the elegance of traditional Indian ethnic wear
        </p>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/products')}
            style={{
              padding: '1.2rem 3rem',
              background: 'var(--accent-gold)',
              color: 'var(--primary-maroon)',
              border: 'none',
              borderRadius: '50px',
              fontSize: '1.1rem',
              fontWeight: '700',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
            }}
          >
            Shop Now
          </button>
          <button
            onClick={() => navigate('/products')}
            style={{
              padding: '1.2rem 3rem',
              background: 'transparent',
              color: 'var(--accent-gold)',
              border: '2px solid var(--accent-gold)',
              borderRadius: '50px',
              fontSize: '1.1rem',
              fontWeight: '700',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'var(--accent-gold)';
              e.target.style.color = 'var(--primary-maroon)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = 'var(--accent-gold)';
            }}
          >
            Explore Collections
          </button>
        </div>
      </div>

      {/* Categories Section */}
      <div style={{ padding: '4rem 2rem', maxWidth: '1400px', margin: '0 auto' }}>
        <h2 style={{
          fontFamily: 'Playfair Display',
          fontSize: '3rem',
          color: 'var(--primary-maroon)',
          textAlign: 'center',
          marginBottom: '3rem'
        }}>
          Shop by Category
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {[
            { name: 'Sarees', icon: <ShoppingBag size={48} strokeWidth={1} />, category: 'saree' },
            { name: 'Kurtis', icon: <Shirt size={48} strokeWidth={1} />, category: 'kurti' },
            { name: 'Lehengas', icon: <Layers size={48} strokeWidth={1} />, category: 'lehenga' }
          ].map(cat => (
            <div
              key={cat.category}
              onClick={() => navigate(`/products?category=${cat.category}`)}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '3rem 2rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                border: '2px solid var(--border-color)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(128, 0, 32, 0.2)';
                e.currentTarget.style.borderColor = 'var(--accent-gold)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
              }}
            >
              <div style={{ color: 'var(--primary-maroon)', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>{cat.icon}</div>
              <h3 style={{
                fontFamily: 'Playfair Display',
                fontSize: '2rem',
                color: 'var(--primary-maroon)',
                marginBottom: '0.5rem'
              }}>
                {cat.name}
              </h3>
              <p style={{ color: '#666', fontSize: '1rem' }}>Explore Collection →</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div style={{ padding: '4rem 2rem', background: 'var(--cream-dark)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'Playfair Display',
            fontSize: '3rem',
            color: 'var(--primary-maroon)',
            textAlign: 'center',
            marginBottom: '3rem'
          }}>
            Featured Products
          </h2>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', fontSize: '1.5rem', color: 'var(--primary-maroon)' }}>
              Loading...
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem'
            }}>
              {featuredProducts.map(product => (
                <div
                  key={product._id}
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onClick={() => navigate(`/product/${product._id}`)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-10px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(128, 0, 32, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                  }}
                >
                  <div style={{
                    height: '300px',
                    background: 'var(--cream-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    <img
                      src={product.image && product.image !== '/images/products/default.jpg'
                        ? product.image.startsWith('http') 
                          ? product.image 
                          : `http://localhost:5000${encodeURI(product.image)}`
                        : 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&h=700&fit=crop'
                      }
                      alt={product.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    {product.stock === 0 && (
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        background: 'rgba(0, 0, 0, 0.8)',
                        color: 'white',
                        padding: '1rem 2rem',
                        borderRadius: '8px',
                        fontSize: '1.2rem',
                        fontWeight: '700',
                        border: '2px solid #f44336'
                      }}>
                        OUT OF STOCK
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '1.5rem' }}>
                    <h3 style={{
                      fontFamily: 'Playfair Display',
                      fontSize: '1.3rem',
                      color: 'var(--primary-maroon)',
                      marginBottom: '0.5rem'
                    }}>
                      {product.name}
                    </h3>
                    <p style={{
                      color: '#666',
                      fontSize: '0.9rem',
                      marginBottom: '1rem',
                      lineHeight: '1.6'
                    }}>
                      {product.description.substring(0, 80)}...
                    </p>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{
                        fontFamily: 'Playfair Display',
                        fontSize: '1.6rem',
                        fontWeight: '700',
                        color: 'var(--primary-maroon)'
                      }}>
                        ₹{product.price}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/product/${product._id}`);
                        }}
                        style={{
                          padding: '0.75rem 1.5rem',
                          background: 'linear-gradient(135deg, var(--primary-maroon) 0%, var(--primary-red) 100%)',
                          color: 'var(--accent-gold)',
                          border: '2px solid var(--accent-gold)',
                          borderRadius: '50px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          fontSize: '0.9rem'
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button
              onClick={() => navigate('/products')}
              style={{
                padding: '1rem 3rem',
                background: 'linear-gradient(135deg, var(--primary-maroon) 0%, var(--primary-red) 100%)',
                color: 'var(--accent-gold)',
                border: '2px solid var(--accent-gold)',
                borderRadius: '50px',
                fontSize: '1rem',
                fontWeight: '700',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '1.5px'
              }}
            >
              View All Products
            </button>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div style={{ padding: '4rem 2rem', maxWidth: '1400px', margin: '0 auto' }}>
        <h2 style={{
          fontFamily: 'Playfair Display',
          fontSize: '3rem',
          color: 'var(--primary-maroon)',
          textAlign: 'center',
          marginBottom: '3rem'
        }}>
          Why Choose Thread Story
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem'
        }}>
          {[
            { icon: <Star size={40} />, title: 'Premium Quality', desc: 'Handpicked fabrics and materials' },
            { icon: <Truck size={40} />, title: 'Free Shipping', desc: 'On orders above ₹999' },
            { icon: <ShieldCheck size={40} />, title: 'Secure Payment', desc: 'Multiple payment options' },
            { icon: <RefreshCw size={40} />, title: 'Easy Returns', desc: '7-day return policy' }
          ].map((feature, idx) => (
            <div key={idx} style={{
              textAlign: 'center',
              padding: '2rem'
            }}>
              <div style={{ color: 'var(--primary-maroon)', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>{feature.icon}</div>
              <h3 style={{
                fontFamily: 'Playfair Display',
                fontSize: '1.3rem',
                color: 'var(--primary-maroon)',
                marginBottom: '0.5rem'
              }}>
                {feature.title}
              </h3>
              <p style={{ color: '#666' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}





