import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Check, X, Image as ImageIcon } from 'lucide-react';
import { useCart } from "./components/context/CartContext";
import api from "./components/context/services/api";

const sampleProducts = [
  { id: "s1", name: "Royal Silk Saree", price: 4999, category: "saree", description: "Elegant silk saree with intricate golden border and traditional motifs. Perfect for weddings and special occasions.", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&h=700&fit=crop", sizes: ["Free Size"], colors: ["Maroon", "Gold", "Red"], material: "Pure Silk", care: "Dry clean only", stock: 15 },
  { id: "s2", name: "Banarasi Silk Saree", price: 5999, category: "saree", description: "Traditional Banarasi weave with rich embroidery and zari work. A timeless classic.", image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500&h=700&fit=crop", sizes: ["Free Size"], colors: ["Red", "Gold", "Pink"], material: "Banarasi Silk", care: "Dry clean only", stock: 12 },
  { id: "s3", name: "Designer Georgette Saree", price: 3499, category: "saree", description: "Contemporary georgette saree with modern prints and lightweight fabric.", image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=500&h=700&fit=crop", sizes: ["Free Size"], colors: ["Blue", "Pink", "Green"], material: "Georgette", care: "Hand wash", stock: 20 },
  { id: "s4", name: "Kanjivaram Silk Saree", price: 7999, category: "saree", description: "Premium Kanjivaram silk with temple border and traditional South Indian design.", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&h=700&fit=crop", sizes: ["Free Size"], colors: ["Purple", "Gold"], material: "Kanjivaram Silk", care: "Dry clean only", stock: 8 },
  { id: "k1", name: "Anarkali Kurti", price: 1999, category: "kurti", description: "Flowy Anarkali style kurti with embroidered yoke and elegant silhouette.", image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&h=700&fit=crop", sizes: ["S", "M", "L", "XL"], colors: ["Maroon", "Navy", "Emerald"], material: "Cotton Blend", care: "Machine wash", stock: 25 },
  { id: "k2", name: "Straight Cut Kurti", price: 1499, category: "kurti", description: "Classic straight cut kurti in cotton blend. Comfortable for daily wear.", image: "https://images.unsplash.com/photo-1583391733981-e8c9e2f55e4d?w=500&h=700&fit=crop", sizes: ["S", "M", "L", "XL", "XXL"], colors: ["White", "Black", "Beige"], material: "Cotton", care: "Machine wash", stock: 30 },
  { id: "k3", name: "A-Line Kurti", price: 1799, category: "kurti", description: "Elegant A-line kurti with block prints and modern design.", image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&h=700&fit=crop", sizes: ["S", "M", "L", "XL"], colors: ["Yellow", "Orange", "Pink"], material: "Rayon", care: "Hand wash", stock: 18 },
  { id: "k4", name: "Palazzo Kurti Set", price: 2499, category: "kurti", description: "Trendy kurti with matching palazzo pants. Complete ethnic outfit.", image: "https://images.unsplash.com/photo-1583391733981-e8c9e2f55e4d?w=500&h=700&fit=crop", sizes: ["S", "M", "L", "XL"], colors: ["Teal", "Magenta", "Coral"], material: "Crepe", care: "Machine wash", stock: 22 },
  { id: "l1", name: "Bridal Lehenga", price: 15999, category: "lehenga", description: "Stunning bridal lehenga with heavy embellishments, sequins, and intricate embroidery.", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=700&fit=crop", sizes: ["S", "M", "L"], colors: ["Red", "Maroon", "Pink"], material: "Silk with Zari Work", care: "Dry clean only", stock: 5 },
  { id: "l2", name: "Party Wear Lehenga", price: 8999, category: "lehenga", description: "Glamorous party wear lehenga with sequin work and modern design.", image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=500&h=700&fit=crop", sizes: ["S", "M", "L", "XL"], colors: ["Gold", "Silver", "Rose Gold"], material: "Net with Sequins", care: "Dry clean only", stock: 10 },
  { id: "l3", name: "Festive Lehenga", price: 6999, category: "lehenga", description: "Colorful festive lehenga with mirror work and traditional embroidery.", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=700&fit=crop", sizes: ["S", "M", "L", "XL"], colors: ["Green", "Blue", "Orange"], material: "Silk with Mirror Work", care: "Dry clean only", stock: 14 },
  { id: "l4", name: "Designer Lehenga Choli", price: 12999, category: "lehenga", description: "Designer lehenga with intricate zari work and premium fabric.", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&h=700&fit=crop", sizes: ["S", "M", "L"], colors: ["Navy", "Wine", "Emerald"], material: "Velvet with Zari", care: "Dry clean only", stock: 7 }
];

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Try to get from API first
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        } else {
          // Fallback to sample products
          const sampleProduct = sampleProducts.find(p => p.id === id);
          setProduct(sampleProduct);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        // Fallback to sample products
        const sampleProduct = sampleProducts.find(p => p.id === id);
        setProduct(sampleProduct);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes?.[0] || "");
      setSelectedColor(product.colors?.[0] || "");
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert("Please select size and color");
      return;
    }
    addToCart({ ...product, selectedSize, selectedColor }, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: "#800020" }}>Loading...</div>;
  }

  if (!product) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "40px" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "36px", color: "#800020", marginBottom: "20px" }}>Product Not Found</h2>
        <Link to="/products" style={{ padding: "14px 40px", background: "linear-gradient(135deg, #800020 0%, #a0153e 100%)", color: "#d4af37", textDecoration: "none", borderRadius: "50px", fontSize: "14px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1.5px", border: "2px solid #d4af37" }}>
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#faf8f5", minHeight: "100vh", padding: "60px 20px" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: "40px", fontSize: "14px", color: "#666" }}>
          <Link to="/products" style={{ color: "#800020", textDecoration: "none" }}>Home</Link>
          <span style={{ margin: "0 10px" }}>/</span>
          <Link to="/products" style={{ color: "#800020", textDecoration: "none" }}>Products</Link>
          <span style={{ margin: "0 10px" }}>/</span>
          <span>{product.name}</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", backgroundColor: "white", borderRadius: "20px", padding: "60px", boxShadow: "0 10px 40px rgba(0,0,0,0.08)" }}>
          {/* Image Section */}
          <div>
            <div style={{ borderRadius: "16px", overflow: "hidden", marginBottom: "20px", backgroundColor: "#f5f5f5" }}>
              {product.image ? (
                <img 
                  src={product.image.startsWith('http') 
                    ? product.image 
                    : `http://localhost:5000${encodeURI(product.image)}`
                  } 
                  alt={product.name} 
                  style={{ width: "100%", height: "600px", objectFit: "cover" }} 
                />
              ) : (
                <div style={{ width: "100%", height: "600px", display: "flex", alignItems: "center", justifyContent: "center", color: "#e8d5c4" }}><ImageIcon size={120} strokeWidth={1} /></div>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div>
            <div style={{ marginBottom: "10px", display: "inline-block", padding: "6px 16px", backgroundColor: "#800020", color: "#d4af37", borderRadius: "20px", fontSize: "12px", fontWeight: "700", textTransform: "uppercase" }}>
              {product.category}
            </div>

            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "48px", fontWeight: "700", color: "#800020", marginBottom: "20px", lineHeight: "1.2" }}>
              {product.name}
            </h1>

            <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "30px" }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "42px", fontWeight: "700", color: "#800020" }}>₹{product.price}</span>
              {product.stock > 0 ? (
                <span style={{ color: "#28a745", fontSize: "14px", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}><Check size={16} /> In Stock ({product.stock} available)</span>
              ) : (
                <span style={{ color: "#dc3545", fontSize: "14px", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}><X size={16} /> Out of Stock</span>
              )}
            </div>

            <p style={{ fontSize: "16px", lineHeight: "1.8", color: "#666", marginBottom: "40px", borderBottom: "1px solid #e8d5c4", paddingBottom: "30px" }}>
              {product.description}
            </p>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div style={{ marginBottom: "30px" }}>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#800020", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>Select Size</label>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      style={{
                        padding: "12px 24px",
                        border: selectedSize === size ? "2px solid #d4af37" : "2px solid #e8d5c4",
                        background: selectedSize === size ? "linear-gradient(135deg, #800020 0%, #a0153e 100%)" : "white",
                        color: selectedSize === size ? "#d4af37" : "#800020",
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "600",
                        transition: "all 0.3s ease"
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div style={{ marginBottom: "30px" }}>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#800020", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>Select Color</label>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      style={{
                        padding: "12px 24px",
                        border: selectedColor === color ? "2px solid #d4af37" : "2px solid #e8d5c4",
                        background: selectedColor === color ? "linear-gradient(135deg, #800020 0%, #a0153e 100%)" : "white",
                        color: selectedColor === color ? "#d4af37" : "#800020",
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "600",
                        transition: "all 0.3s ease"
                      }}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div style={{ marginBottom: "40px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#800020", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>Quantity</label>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ width: "40px", height: "40px", borderRadius: "10px", border: "2px solid #d4af37", background: "linear-gradient(135deg, #800020 0%, #a0153e 100%)", cursor: "pointer", fontSize: "20px", fontWeight: "700", color: "#d4af37", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                <span style={{ fontSize: "20px", fontWeight: "600", minWidth: "40px", textAlign: "center" }}>{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} style={{ width: "40px", height: "40px", borderRadius: "10px", border: "2px solid #d4af37", background: "linear-gradient(135deg, #800020 0%, #a0153e 100%)", cursor: "pointer", fontSize: "20px", fontWeight: "700", color: "#d4af37", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              style={{
                width: "100%",
                padding: "18px",
                background: added ? "linear-gradient(135deg, #28a745 0%, #20c997 100%)" : product.stock === 0 ? "#ccc" : "linear-gradient(135deg, #800020 0%, #a0153e 100%)",
                color: "#d4af37",
                border: "2px solid #d4af37",
                borderRadius: "50px",
                fontSize: "16px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "2px",
                cursor: product.stock === 0 ? "not-allowed" : "pointer",
                marginBottom: "20px",
                transition: "all 0.3s ease"
              }}
            >
              {added ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><Check size={20} /> Added to Cart!</span> : product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>

            <button
              onClick={() => navigate("/checkout")}
              style={{
                width: "100%",
                padding: "18px",
                background: "white",
                color: "#800020",
                border: "2px solid #800020",
                borderRadius: "50px",
                fontSize: "16px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "2px",
                cursor: "pointer",
                transition: "all 0.3s ease"
              }}
            >
              Buy Now
            </button>

            {/* Product Info */}
            <div style={{ marginTop: "40px", padding: "30px", backgroundColor: "#faf8f5", borderRadius: "16px" }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", color: "#800020", marginBottom: "20px" }}>Product Details</h3>
              <div style={{ display: "grid", gap: "12px", fontSize: "14px" }}>
                {product.material && (
                  <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "12px", borderBottom: "1px solid #e8d5c4" }}>
                    <span style={{ color: "#666", fontWeight: "500" }}>Material:</span>
                    <span style={{ color: "#800020", fontWeight: "600" }}>{product.material}</span>
                  </div>
                )}
                {product.care && (
                  <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "12px", borderBottom: "1px solid #e8d5c4" }}>
                    <span style={{ color: "#666", fontWeight: "500" }}>Care:</span>
                    <span style={{ color: "#800020", fontWeight: "600" }}>{product.care}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#666", fontWeight: "500" }}>Category:</span>
                  <span style={{ color: "#800020", fontWeight: "600", textTransform: "capitalize" }}>{product.category}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
