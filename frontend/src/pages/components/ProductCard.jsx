import { Link } from "react-router-dom";
import { useCart } from "./context/CartContext";
import { useWishlist } from "./context/WishlistContext";
import { useState } from "react";
import { useToast } from "./Toast";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();
  const [added, setAdded] = useState(false);
  const inWishlist = isInWishlist(product._id || product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWishlist(product);
    showToast(added ? 'Added to wishlist!' : 'Removed from wishlist', added ? 'success' : 'info');
  };

  return (
    <Link to={`/product/${product._id || product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
      <div style={{ backgroundColor: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", transition: "all 0.3s ease", cursor: "pointer" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-8px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.15)"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)"; }}>
        
        <div style={{ position: "relative", height: "350px", backgroundColor: "#f5f5f5", overflow: "hidden" }}>
          <img 
            src={product.image && product.image !== '/images/products/default.jpg' 
              ? product.image 
              : 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&h=700&fit=crop'
            } 
            alt={product.name} 
            style={{ 
              width: "100%", 
              height: "100%", 
              objectFit: "cover", 
              transition: "transform 0.5s ease",
              opacity: product.stock === 0 ? 0.5 : 1
            }} 
            onMouseEnter={(e) => e.target.style.transform = "scale(1.1)"} 
            onMouseLeave={(e) => e.target.style.transform = "scale(1)"} 
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
          
          <div style={{ position: "absolute", top: "15px", right: "15px", padding: "8px 16px", background: "linear-gradient(135deg, #800020 0%, #a0153e 100%)", color: "#d4af37", borderRadius: "50px", fontSize: "11px", fontWeight: "700", border: "2px solid #d4af37", boxShadow: "0 4px 15px rgba(128, 0, 32, 0.3)" }}>NEW</div>
          
          <button
            onClick={handleWishlistToggle}
            style={{
              position: "absolute",
              top: "15px",
              left: "15px",
              width: "45px",
              height: "45px",
              borderRadius: "50%",
              background: "white",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
              boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => e.target.style.transform = "scale(1.1)"}
            onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
          >
            {inWishlist ? '❤️' : '🤍'}
          </button>
        </div>
        
        <div style={{ padding: "24px" }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: "700", color: "#800020", marginBottom: "10px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{product.name}</h3>
          
          <p style={{ fontSize: "14px", color: "#666", marginBottom: "20px", lineHeight: "1.6", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{product.description || "Exquisite ethnic wear crafted with precision and care"}</p>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "20px", borderTop: "1px solid #f0f0f0" }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: "700", color: "#800020" }}>₹{product.price || "0"}</span>
            <button 
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              style={{ 
                padding: "10px 20px", 
                background: product.stock === 0
                  ? "#ccc"
                  : added 
                    ? "linear-gradient(135deg, #28a745 0%, #20c997 100%)" 
                    : "linear-gradient(135deg, #800020 0%, #a0153e 100%)", 
                color: product.stock === 0 ? "#666" : "#d4af37", 
                border: "2px solid #d4af37", 
                borderRadius: "50px", 
                fontSize: "12px", 
                fontWeight: "700", 
                textTransform: "uppercase", 
                letterSpacing: "1px", 
                cursor: product.stock === 0 ? "not-allowed" : "pointer", 
                transition: "all 0.3s ease" 
              }} 
              onMouseEnter={(e) => { if (!added && product.stock > 0) { e.target.style.background = "linear-gradient(135deg, #a0153e 0%, #800020 100%)"; e.target.style.transform = "scale(1.05)"; } }} 
              onMouseLeave={(e) => { if (!added && product.stock > 0) { e.target.style.background = "linear-gradient(135deg, #800020 0%, #a0153e 100%)"; e.target.style.transform = "scale(1)"; } }}
            >
              {product.stock === 0 ? "Out of Stock" : added ? "✓ Added!" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
