import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Heart, HeartOff, ShoppingBag, Sparkles, Shirt, Layers, Star, Palette, Truck, Mail, Phone, MessageCircle, Check } from 'lucide-react';
import { useWishlist } from "./components/context/WishlistContext";
import { useCart } from "./components/context/CartContext";
import { useToast } from "./components/Toast";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BASE_URL = API_URL.replace('/api', '');

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [added, setAdded] = useState(false);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();
  const { addToCart } = useCart();
  const inWishlist = isInWishlist(product._id || product.id);

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Wishlist toggle clicked', product.id || product._id);
    const added = toggleWishlist(product);
    console.log('Toggle result:', added);
    showToast(added ? 'Added to wishlist!' : 'Removed from wishlist', added ? 'success' : 'info');
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    showToast('Added to cart!', 'success');
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "relative",
        borderRadius: "24px",
        overflow: "hidden",
        backgroundColor: "white",
        boxShadow: isHovered ? "0 20px 60px rgba(128, 0, 32, 0.25)" : "0 8px 30px rgba(0, 0, 0, 0.08)",
        transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: isHovered ? "translateY(-12px)" : "translateY(0)",
        border: "1px solid #f0e8dc"
      }}
    >
      <div style={{ position: "relative", overflow: "hidden", paddingTop: "120%", backgroundColor: "#faf8f5" }}>
        <img
          src={product.image && product.image !== '/images/products/default.jpg'
            ? product.image.startsWith('http')
              ? product.image
              : `${BASE_URL}${encodeURI(product.image)}`
            : 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&h=700&fit=crop'
          }
          alt={product.name}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: isHovered ? "scale(1.08)" : "scale(1)",
            opacity: product.stock === 0 ? 0.5 : 1
          }}
        />
        {product.stock === 0 && (
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "rgba(0, 0, 0, 0.85)",
            color: "white",
            padding: "1rem 2rem",
            borderRadius: "12px",
            fontSize: "1.1rem",
            fontWeight: "700",
            border: "2px solid #f44336",
            zIndex: 5,
            textAlign: "center",
            letterSpacing: "1px"
          }}>
            OUT OF STOCK
          </div>
        )}
        <button
          onClick={handleWishlistToggle}
          onMouseDown={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            transition: "all 0.3s ease",
            transform: isHovered ? "scale(1.1) rotate(12deg)" : "scale(1) rotate(0deg)",
            border: "none",
            zIndex: 10
          }}
          onMouseEnter={(e) => {
            e.stopPropagation();
            e.target.style.transform = "scale(1.2)";
          }}
          onMouseLeave={(e) => {
            e.stopPropagation();
            e.target.style.transform = isHovered ? "scale(1.1) rotate(12deg)" : "scale(1)";
          }}
        >
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "#800020" }}>
            {inWishlist ? <Heart fill="#800020" size={24} /> : <Heart size={24} />}
          </span>
        </button>
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)",
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.4s ease"
        }} />
      </div>

      <div style={{ padding: "20px" }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px"
        }}>
          <div style={{
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "2px",
            color: "#d4af37",
            fontWeight: "700"
          }}>
            {product.category}
          </div>
          {product.stock !== undefined && (
            <div style={{
              fontSize: "11px",
              padding: "4px 12px",
              borderRadius: "12px",
              fontWeight: "700",
              background: product.stock === 0
                ? "#ffebee"
                : product.stock < 5
                  ? "#fff3cd"
                  : "#e8f5e9",
              color: product.stock === 0
                ? "#c62828"
                : product.stock < 5
                  ? "#f57c00"
                  : "#2e7d32"
            }}>
              {product.stock === 0 ? "Out of Stock" : `${product.stock} in stock`}
            </div>
          )}
        </div>

        <h3 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "20px",
          fontWeight: "700",
          color: "#800020",
          marginBottom: "10px",
          lineHeight: "1.3"
        }}>
          {product.name}
        </h3>

        <p style={{
          fontSize: "13px",
          color: "#666",
          marginBottom: "16px",
          lineHeight: "1.6",
          height: "36px",
          overflow: "hidden"
        }}>
          {product.description}
        </p>

        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: "20px",
          borderTop: "1px solid #f0e8dc"
        }}>
          <div>
            <div style={{ fontSize: "12px", color: "#999", marginBottom: "4px" }}>Price</div>
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "24px",
              fontWeight: "700",
              color: "#800020"
            }}>
              ₹{product.price.toLocaleString()}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            style={{
              padding: "12px 24px",
              background: product.stock === 0
                ? "#ccc"
                : added
                  ? "linear-gradient(135deg, #28a745 0%, #20c997 100%)"
                  : isHovered
                    ? "linear-gradient(135deg, #a0153e 0%, #800020 100%)"
                    : "linear-gradient(135deg, #800020 0%, #a0153e 100%)",
              color: product.stock === 0 ? "#666" : "#d4af37",
              border: "none",
              borderRadius: "50px",
              fontSize: "13px",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              cursor: product.stock === 0 ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 6px 20px rgba(128, 0, 32, 0.3)"
            }}>
            {product.stock === 0 ? "Out of Stock" : added ? <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} /> Added!</span> : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("featured");
  const [scrollY, setScrollY] = useState(0);
  const [searchParams] = useSearchParams();
  const collectionsRef = useRef(null);

  useEffect(() => {
    // Check for category in URL params
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
      // Scroll to collections section after a short delay
      setTimeout(() => {
        if (collectionsRef.current) {
          collectionsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/products`);
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const categories = [
    { id: "featured", name: "FEATURED", icon: <Sparkles size={18} /> },
    { id: "all", name: "ALL", icon: <ShoppingBag size={18} /> },
    { id: "saree", name: "SAREES", icon: <Layers size={18} /> },
    { id: "kurti", name: "KURTIS", icon: <Shirt size={18} /> },
    { id: "lehenga", name: "LEHENGAS", icon: <Layers size={18} /> }
  ];

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    // Scroll to collections section
    if (collectionsRef.current) {
      collectionsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  let filteredProducts = products;
  if (selectedCategory === "featured") {
    filteredProducts = products.slice(0, 4);
  } else if (selectedCategory !== "all") {
    filteredProducts = products.filter(p => p.category?.toLowerCase() === selectedCategory);
  }

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#faf8f5" }}>
        <div style={{
          width: "80px",
          height: "80px",
          border: "4px solid #f0e8dc",
          borderTop: "4px solid #800020",
          borderRadius: "50%",
          animation: "spin 1s linear infinite"
        }} />
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", color: "#800020", marginTop: "30px" }}>Loading Elegance...</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#faf8f5", minHeight: "100vh" }}>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>

      {/* Enhanced Hero */}
      <div style={{ position: "relative", background: "linear-gradient(135deg, #1a0008 0%, #800020 40%, #a0153e 70%, #c41e3a 100%)", padding: "160px 40px 120px", textAlign: "center", color: "white", overflow: "hidden" }}>
        {/* Animated Background Elements */}
        <div style={{ position: "absolute", top: "10%", left: "5%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(212,175,55,0.2) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(80px)", animation: "float 8s ease-in-out infinite" }}></div>
        <div style={{ position: "absolute", bottom: "15%", right: "8%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(100px)", animation: "float 10s ease-in-out infinite", animationDelay: "2s" }}></div>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "300px", height: "300px", background: "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(60px)", animation: "pulse 6s ease-in-out infinite" }}></div>

        {/* Enhanced Pattern Overlay */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"80\" height=\"80\" viewBox=\"0 0 80 80\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.04\"%3E%3Cpath d=\"M40 46v-6h-3v6h-6v3h6v6h3v-6h6v-3h-6zm0-40V0h-3v6h-6v3h6v6h3V9h6V6h-6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')", opacity: 0.5 }}></div>

        <div style={{ position: "relative", zIndex: 1, maxWidth: "1000px", margin: "0 auto", transform: `translateY(${scrollY * 0.1}px)` }}>
          {/* Enhanced Badge with shimmer */}
          <div style={{
            display: "inline-block",
            padding: "12px 32px",
            background: "linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0.25) 100%)",
            border: "2px solid #d4af37",
            borderRadius: "50px",
            marginBottom: "35px",
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 30px rgba(212, 175, 55, 0.2), inset 0 1px 1px rgba(255,255,255,0.1)",
            animation: "pulse 3s ease-in-out infinite"
          }}>
            <span style={{
              fontSize: "13px",
              textTransform: "uppercase",
              letterSpacing: "4px",
              color: "#d4af37",
              fontWeight: "700",
              textShadow: "0 2px 10px rgba(212, 175, 55, 0.5)",
              display: "flex", alignItems: "center", gap: "10px"
            }}>
              <Sparkles size={16} /> Timeless Collection <Sparkles size={16} />
            </span>
          </div>

          {/* Enhanced Main Heading with glowing effect */}
          <div style={{ marginBottom: "40px" }}>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "90px",
              fontWeight: "900",
              lineHeight: "1.1",
              marginBottom: "5px",
              textShadow: "3px 5px 15px rgba(0,0,0,0.4), 0 0 40px rgba(212,175,55,0.3)",
              letterSpacing: "-2px",
              animation: "fadeInUp 1s ease-out"
            }}>
              Where Tradition
            </h1>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "90px",
              fontWeight: "900",
              background: "linear-gradient(135deg, #d4af37 0%, #f4d03f 50%, #d4af37 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontStyle: "italic",
              lineHeight: "1.1",
              textShadow: "3px 5px 15px rgba(0,0,0,0.4)",
              letterSpacing: "-2px",
              animation: "fadeInUp 1s ease-out 0.2s backwards"
            }}>
              Meets Elegance
            </h1>
          </div>

          {/* Enhanced Subtitle */}
          <p style={{
            fontSize: "24px",
            maxWidth: "750px",
            margin: "0 auto 50px",
            lineHeight: "1.8",
            opacity: "0.95",
            fontWeight: "300",
            textShadow: "1px 2px 8px rgba(0,0,0,0.3)",
            animation: "fadeInUp 1s ease-out 0.4s backwards"
          }}>
            Discover meticulously crafted ethnic wear that celebrates heritage with contemporary grace
          </p>

          {/* Enhanced CTA Buttons */}
          <div style={{ display: "flex", gap: "25px", justifyContent: "center", flexWrap: "wrap", marginBottom: "70px", animation: "fadeInUp 1s ease-out 0.6s backwards" }}>
            <button
              onClick={() => handleCategoryClick("all")}
              style={{
                padding: "18px 48px",
                background: "linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)",
                color: "#800020",
                border: "none",
                borderRadius: "50px",
                fontSize: "15px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "2px",
                cursor: "pointer",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: "0 10px 35px rgba(212, 175, 55, 0.5), inset 0 1px 1px rgba(255,255,255,0.3)",
                position: "relative",
                overflow: "hidden"
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-4px) scale(1.05)";
                e.target.style.boxShadow = "0 15px 45px rgba(212, 175, 55, 0.6)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0) scale(1)";
                e.target.style.boxShadow = "0 10px 35px rgba(212, 175, 55, 0.5)";
              }}
            >
              Shop Now
            </button>
            <button
              onClick={() => handleCategoryClick("all")}
              style={{
                padding: "18px 48px",
                background: "rgba(255, 255, 255, 0.1)",
                color: "white",
                border: "2px solid rgba(255,255,255,0.8)",
                borderRadius: "50px",
                fontSize: "15px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "2px",
                cursor: "pointer",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 10px 35px rgba(0, 0, 0, 0.2)"
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.95)";
                e.target.style.color = "#800020";
                e.target.style.transform = "translateY(-4px) scale(1.05)";
                e.target.style.boxShadow = "0 15px 45px rgba(255, 255, 255, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.1)";
                e.target.style.color = "white";
                e.target.style.transform = "translateY(0) scale(1)";
                e.target.style.boxShadow = "0 10px 35px rgba(0, 0, 0, 0.2)";
              }}
            >
              Explore Collections
            </button>
          </div>

          {/* Enhanced Stats */}
          <div style={{ display: "flex", justifyContent: "center", gap: "80px", flexWrap: "wrap" }}>
            {[
              { value: "500+", label: "Products" },
              { value: "50K+", label: "Happy Customers" },
              { value: "100%", label: "Authentic" }
            ].map((stat, i) => (
              <div key={i} style={{ animation: `fadeInUp 1s ease-out ${0.8 + i * 0.1}s backwards` }}>
                <div style={{
                  fontSize: "48px",
                  fontWeight: "900",
                  background: "linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  marginBottom: "8px",
                  textShadow: "0 4px 20px rgba(212, 175, 55, 0.3)"
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontSize: "14px",
                  opacity: "0.9",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  fontWeight: "600"
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Animated Scroll Indicator */}
        <div style={{
          position: "absolute",
          bottom: "40px",
          left: "50%",
          transform: "translateX(-50%)",
          animation: "float 3s ease-in-out infinite"
        }}>
          <div style={{
            width: "32px",
            height: "55px",
            border: "3px solid rgba(255,255,255,0.6)",
            borderRadius: "25px",
            display: "flex",
            justifyContent: "center",
            paddingTop: "10px",
            backdropFilter: "blur(10px)",
            background: "rgba(255,255,255,0.05)"
          }}>
            <div style={{
              width: "5px",
              height: "10px",
              backgroundColor: "rgba(212,175,55,0.9)",
              borderRadius: "3px",
              animation: "float 2s ease-in-out infinite"
            }}></div>
          </div>
        </div>
      </div>

      {/* Enhanced Collections Section */}
      <div ref={collectionsRef} style={{ maxWidth: "1400px", margin: "0 auto", padding: "100px 40px" }}>
        <div style={{ textAlign: "center", marginBottom: "70px" }}>
          <div style={{
            display: "inline-block",
            fontSize: "14px",
            textTransform: "uppercase",
            letterSpacing: "4px",
            color: "#d4af37",
            fontWeight: "700",
            marginBottom: "15px",
            padding: "8px 24px",
            border: "2px solid #d4af37",
            borderRadius: "30px",
            background: "linear-gradient(135deg, rgba(212,175,55,0.05) 0%, rgba(212,175,55,0.1) 100%)"
          }}>
            Our Collections
          </div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "56px",
            fontWeight: "900",
            color: "#800020",
            marginBottom: "20px",
            letterSpacing: "-1px"
          }}>
            {selectedCategory === "featured" ? "Featured Collection" : selectedCategory === "all" ? "All Collections" : `${categories.find(c => c.id === selectedCategory)?.name || "Products"}`}
          </h2>
          <div style={{
            width: "80px",
            height: "4px",
            background: "linear-gradient(90deg, transparent, #d4af37, transparent)",
            margin: "0 auto"
          }}></div>
        </div>

        {/* Enhanced Filters */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "18px",
          marginBottom: "70px",
          flexWrap: "wrap",
          padding: "20px",
          background: "white",
          borderRadius: "60px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.06)",
          border: "1px solid #f0e8dc",
          maxWidth: "fit-content",
          margin: "0 auto 70px"
        }}>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              style={{
                padding: "16px 36px",
                borderRadius: "50px",
                fontSize: "13px",
                fontWeight: "700",
                letterSpacing: "2px",
                cursor: "pointer",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                border: "none",
                background: selectedCategory === cat.id
                  ? "linear-gradient(135deg, #800020 0%, #a0153e 100%)"
                  : "transparent",
                color: selectedCategory === cat.id ? "#d4af37" : "#800020",
                boxShadow: selectedCategory === cat.id
                  ? "0 10px 30px rgba(128, 0, 32, 0.35), inset 0 1px 1px rgba(255,255,255,0.1)"
                  : "none",
                transform: selectedCategory === cat.id ? "translateY(-2px)" : "translateY(0)"
              }}
              onMouseEnter={(e) => {
                if (selectedCategory !== cat.id) {
                  e.target.style.background = "linear-gradient(135deg, #faf8f5 0%, #f5f0e8 100%)";
                  e.target.style.transform = "translateY(-2px)";
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCategory !== cat.id) {
                  e.target.style.background = "transparent";
                  e.target.style.transform = "translateY(0)";
                }
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>{cat.icon} {cat.name}</span>
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "100px 20px" }}>
            <div style={{ marginBottom: "20px", opacity: "0.3", display: "flex", justifyContent: "center", color: "#800020" }}><ShoppingBag size={80} strokeWidth={1} /></div>
            <h3 style={{ fontSize: "32px", color: "#800020", fontFamily: "'Playfair Display', serif", marginBottom: "10px" }}>No products available</h3>
            <p style={{ color: "#999", fontSize: "16px" }}>Check back later for new arrivals!</p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "24px"
          }}>
            {filteredProducts.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        )}

        {/* Enhanced View All Button */}
        {selectedCategory === "featured" && (
          <div style={{ textAlign: "center", marginTop: "80px" }}>
            <button
              onClick={() => handleCategoryClick("all")}
              style={{
                padding: "20px 60px",
                background: "linear-gradient(135deg, #800020 0%, #a0153e 100%)",
                color: "#d4af37",
                border: "3px solid #d4af37",
                borderRadius: "50px",
                fontSize: "15px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "2.5px",
                cursor: "pointer",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: "0 12px 35px rgba(128, 0, 32, 0.4)"
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "linear-gradient(135deg, #a0153e 0%, #c41e3a 100%)";
                e.target.style.transform = "translateY(-4px) scale(1.05)";
                e.target.style.boxShadow = "0 20px 50px rgba(128, 0, 32, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "linear-gradient(135deg, #800020 0%, #a0153e 100%)";
                e.target.style.transform = "translateY(0) scale(1)";
                e.target.style.boxShadow = "0 12px 35px rgba(128, 0, 32, 0.4)";
              }}
            >
              View All Collections →
            </button>
          </div>
        )}
      </div>

      {/* Enhanced About Section */}
      <div style={{
        backgroundColor: "white",
        padding: "100px 40px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Decorative Background */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "300px",
          background: "linear-gradient(180deg, #faf8f5 0%, white 100%)",
          zIndex: 0
        }}></div>

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-block",
            fontSize: "14px",
            textTransform: "uppercase",
            letterSpacing: "4px",
            color: "#d4af37",
            fontWeight: "700",
            marginBottom: "15px",
            padding: "8px 24px",
            border: "2px solid #d4af37",
            borderRadius: "30px",
            background: "linear-gradient(135deg, rgba(212,175,55,0.05) 0%, rgba(212,175,55,0.1) 100%)"
          }}>
            About Us
          </div>

          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "56px",
            fontWeight: "900",
            color: "#800020",
            marginBottom: "20px",
            letterSpacing: "-1px"
          }}>
            Our Story
          </h2>

          <div style={{
            width: "80px",
            height: "4px",
            background: "linear-gradient(90deg, transparent, #d4af37, transparent)",
            margin: "0 auto 40px"
          }}></div>

          <p style={{
            fontSize: "20px",
            color: "#666",
            maxWidth: "900px",
            margin: "0 auto 80px",
            lineHeight: "1.9",
            fontWeight: "300"
          }}>
            Thread Story brings you the finest collection of ethnic wear, blending traditional craftsmanship with contemporary designs. Each piece tells a story of heritage, elegance, and timeless beauty.
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "35px",
            maxWidth: "1200px",
            margin: "0 auto"
          }}>
            {[
              { icon: <Star size={48} strokeWidth={1} />, title: "Premium Quality", desc: "Handpicked fabrics and materials" },
              { icon: <Palette size={48} strokeWidth={1} />, title: "Unique Designs", desc: "Exclusive patterns and styles" },
              { icon: <Truck size={48} strokeWidth={1} />, title: "Fast Delivery", desc: "Quick and secure shipping" }
            ].map((feature, i) => (
              <div
                key={i}
                style={{
                  padding: "50px 40px",
                  background: "linear-gradient(135deg, #faf8f5 0%, #f5f0e8 100%)",
                  borderRadius: "30px",
                  border: "2px solid #e8d5c4",
                  transition: "all 0.4s ease",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-10px)";
                  e.currentTarget.style.boxShadow = "0 20px 50px rgba(128, 0, 32, 0.15)";
                  e.currentTarget.style.borderColor = "#d4af37";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "#e8d5c4";
                }}
              >
                <div style={{ color: "#800020", marginBottom: "25px", animation: "float 3s ease-in-out infinite", animationDelay: `${i * 0.2}s` }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "26px",
                  fontWeight: "700",
                  color: "#800020",
                  marginBottom: "12px"
                }}>
                  {feature.title}
                </h3>
                <p style={{ color: "#666", fontSize: "16px", lineHeight: "1.6" }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Contact Section */}
      <div style={{
        background: "linear-gradient(135deg, #1a0008 0%, #800020 40%, #a0153e 70%, #c41e3a 100%)",
        padding: "100px 40px",
        textAlign: "center",
        color: "white",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Decorative Elements */}
        <div style={{
          position: "absolute",
          top: "20%",
          left: "10%",
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(60px)"
        }}></div>
        <div style={{
          position: "absolute",
          bottom: "20%",
          right: "10%",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(212,175,55,0.1) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(80px)"
        }}></div>

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-block",
            fontSize: "14px",
            textTransform: "uppercase",
            letterSpacing: "4px",
            color: "#d4af37",
            fontWeight: "700",
            marginBottom: "15px",
            padding: "8px 24px",
            border: "2px solid #d4af37",
            borderRadius: "30px",
            background: "rgba(212, 175, 55, 0.1)",
            backdropFilter: "blur(10px)"
          }}>
            Get in Touch
          </div>

          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "56px",
            fontWeight: "900",
            color: "#d4af37",
            marginBottom: "20px",
            letterSpacing: "-1px",
            textShadow: "2px 4px 10px rgba(0,0,0,0.3)"
          }}>
            Contact Us
          </h2>

          <p style={{
            fontSize: "22px",
            marginBottom: "50px",
            opacity: "0.95",
            fontWeight: "300",
            maxWidth: "600px",
            margin: "0 auto 50px"
          }}>
            Have questions? We'd love to hear from you!
          </p>

          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "25px",
            flexWrap: "wrap"
          }}>
            <a
              href="mailto:contact@threadstory.com"
              style={{
                padding: "20px 45px",
                background: "linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)",
                color: "#800020",
                textDecoration: "none",
                borderRadius: "50px",
                fontSize: "16px",
                fontWeight: "700",
                boxShadow: "0 10px 30px rgba(212, 175, 55, 0.4)",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                border: "none"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px) scale(1.05)";
                e.currentTarget.style.boxShadow = "0 15px 45px rgba(212, 175, 55, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(212, 175, 55, 0.4)";
              }}
            >
              <Mail size={20} />
              contact@threadstory.com
            </a>

            <a
              href="tel:+919876543210"
              style={{
                padding: "20px 45px",
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                color: "#800020",
                textDecoration: "none",
                borderRadius: "50px",
                fontSize: "16px",
                fontWeight: "700",
                boxShadow: "0 10px 30px rgba(255, 255, 255, 0.3)",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                border: "2px solid transparent"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px) scale(1.05)";
                e.currentTarget.style.backgroundColor = "white";
                e.currentTarget.style.borderColor = "#d4af37";
                e.currentTarget.style.boxShadow = "0 15px 45px rgba(255, 255, 255, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.95)";
                e.currentTarget.style.borderColor = "transparent";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(255, 255, 255, 0.3)";
              }}
            >
              <Phone size={20} />
              +91 98765 43210
            </a>
          </div>
        </div>
      </div>

      {/* Enhanced WhatsApp Button */}
      <a
        href="https://wa.me/1234567890"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "fixed",
          bottom: "35px",
          right: "35px",
          width: "70px",
          height: "70px",
          background: "linear-gradient(135deg, #800020 0%, #a0153e 100%)",
          color: "#d4af37",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "32px",
          boxShadow: "0 12px 40px rgba(128, 0, 32, 0.5)",
          border: "3px solid #d4af37",
          textDecoration: "none",
          zIndex: "1000",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          animation: "pulse 3s ease-in-out infinite"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.15) rotate(10deg)";
          e.currentTarget.style.boxShadow = "0 15px 50px rgba(128, 0, 32, 0.6)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1) rotate(0deg)";
          e.currentTarget.style.boxShadow = "0 12px 40px rgba(128, 0, 32, 0.5)";
        }}
      >
        <MessageCircle size={32} />
      </a>
    </div>
  );
}