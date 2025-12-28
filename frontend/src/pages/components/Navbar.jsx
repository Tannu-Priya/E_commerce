/*import { Link } from "react-router-dom";
import { useCart } from "./context/CartContext";

export default function Navbar() {
  const { getCartCount } = useCart();
  const cartCount = getCartCount();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <nav style={{ backgroundColor: "#faf8f5", position: "sticky", top: 0, zIndex: 100, borderBottom: "2px solid #d4af37", boxShadow: "0 2px 15px rgba(0,0,0,0.08)" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link to="/" style={{ fontFamily: "'Playfair Display', serif", fontSize: "32px", fontWeight: "700", color: "#800020", textDecoration: "none", letterSpacing: "3px", transition: "color 0.3s ease" }} onMouseEnter={(e) => e.target.style.color = "#d4af37"} onMouseLeave={(e) => e.target.style.color = "#800020"}>
          THREAD STORY
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
          <Link to="/products" style={{ fontSize: "14px", fontWeight: "500", color: "#800020", textDecoration: "none", textTransform: "uppercase", letterSpacing: "1px", transition: "color 0.3s ease" }} onMouseEnter={(e) => e.target.style.color = "#d4af37"} onMouseLeave={(e) => e.target.style.color = "#800020"}>Collections</Link>
          
          {user && user.role === 'admin' && (
            <Link to="/admin" style={{ fontSize: "14px", fontWeight: "500", color: "#800020", textDecoration: "none", textTransform: "uppercase", letterSpacing: "1px", transition: "color 0.3s ease" }} onMouseEnter={(e) => e.target.style.color = "#d4af37"} onMouseLeave={(e) => e.target.style.color = "#800020"}>
              Admin 👑
            </Link>
          )}
          
          <Link to="/orders" style={{ fontSize: "14px", fontWeight: "500", color: "#800020", textDecoration: "none", textTransform: "uppercase", letterSpacing: "1px", transition: "color 0.3s ease" }} onMouseEnter={(e) => e.target.style.color = "#d4af37"} onMouseLeave={(e) => e.target.style.color = "#800020"}>Orders</Link>
          
          <Link to="/checkout" style={{ fontSize: "14px", fontWeight: "500", color: "#800020", textDecoration: "none", textTransform: "uppercase", letterSpacing: "1px", transition: "color 0.3s ease", position: "relative" }} onMouseEnter={(e) => e.target.style.color = "#d4af37"} onMouseLeave={(e) => e.target.style.color = "#800020"}>
            Cart 🛒
            {cartCount > 0 && (
              <span style={{ position: "absolute", top: "-8px", right: "-12px", backgroundColor: "#800020", color: "#d4af37", borderRadius: "50%", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700", border: "2px solid #d4af37" }}>
                {cartCount}
              </span>
            )}
          </Link>
          
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <span style={{ fontSize: "14px", color: "#800020", fontWeight: "500" }}>
                {user.name}
              </span>
              <button onClick={handleLogout} style={{ padding: "12px 28px", fontSize: "14px", fontWeight: "600", color: "#faf8f5", background: "linear-gradient(135deg, #800020 0%, #a0153e 100%)", textDecoration: "none", borderRadius: "50px", textTransform: "uppercase", letterSpacing: "1.5px", boxShadow: "0 4px 15px rgba(128, 0, 32, 0.3)", transition: "all 0.3s ease", border: "none", cursor: "pointer" }} onMouseEnter={(e) => { e.target.style.background = "linear-gradient(135deg, #a0153e 0%, #800020 100%)"; e.target.style.transform = "translateY(-2px)"; }} onMouseLeave={(e) => { e.target.style.background = "linear-gradient(135deg, #800020 0%, #a0153e 100%)"; e.target.style.transform = "translateY(0)"; }}>
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" style={{ padding: "12px 28px", fontSize: "14px", fontWeight: "600", color: "#faf8f5", background: "linear-gradient(135deg, #800020 0%, #a0153e 100%)", textDecoration: "none", borderRadius: "50px", textTransform: "uppercase", letterSpacing: "1.5px", boxShadow: "0 4px 15px rgba(128, 0, 32, 0.3)", transition: "all 0.3s ease" }} onMouseEnter={(e) => { e.target.style.background = "linear-gradient(135deg, #a0153e 0%, #800020 100%)"; e.target.style.transform = "translateY(-2px)"; }} onMouseLeave={(e) => { e.target.style.background = "linear-gradient(135deg, #800020 0%, #a0153e 100%)"; e.target.style.transform = "translateY(0)"; }}>Sign In</Link>
          )}
        </div>
      </div>
    </nav>
  );
}*/

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "./context/CartContext";
import { useWishlist } from "./context/WishlistContext";

export default function Navbar() {
  const { getCartCount } = useCart();
  const { wishlist } = useWishlist();
  const cartCount = getCartCount();
  const wishlistCount = wishlist.length;
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [scrolled, setScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <>
      <style>{`
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(212, 175, 55, 0.6);
          }
        }
      `}</style>

      <nav style={{
        background: scrolled
          ? "rgba(250, 248, 245, 0.98)"
          : "linear-gradient(135deg, rgba(250, 248, 245, 0.95) 0%, rgba(255, 255, 255, 0.95) 100%)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        borderBottom: scrolled ? "1px solid #d4af37" : "2px solid #d4af37",
        boxShadow: scrolled
          ? "0 8px 32px rgba(128, 0, 32, 0.12)"
          : "0 4px 20px rgba(0, 0, 0, 0.08)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        animation: "slideDown 0.6s ease-out"
      }}>
        {/* Decorative Top Border */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: "linear-gradient(90deg, transparent, #d4af37, transparent)",
          opacity: scrolled ? 1 : 0,
          transition: "opacity 0.4s ease"
        }}></div>

        <div style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: scrolled ? "16px 40px" : "24px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          transition: "padding 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
        }}>
          {/* Logo */}
          <Link
            to="/products"
            onClick={() => window.scrollTo(0, 0)}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "28px",
              fontWeight: "900",
              color: "#d4af37",
              textDecoration: "none",
              textTransform: "uppercase",
              letterSpacing: "4px",
              position: "relative",
              zIndex: 10,
              cursor: "pointer",
              transition: "transform 0.3s ease, letter-spacing 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: "12px"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.letterSpacing = "6px";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.letterSpacing = "4px";
            }}
          >
            THREAD STORY
          </Link>

          {/* Navigation Links */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "45px"
          }}>
            {/* Collections Link */}
            <Link
              to="/collections"
              onMouseEnter={() => setHoveredLink('collections')}
              onMouseLeave={() => setHoveredLink(null)}
              style={{
                fontSize: "14px",
                fontWeight: "700",
                color: hoveredLink === 'collections' ? "#d4af37" : "#800020",
                textDecoration: "none",
                textTransform: "uppercase",
                letterSpacing: "2px",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                position: "relative",
                padding: "8px 0",
                transform: hoveredLink === 'collections' ? "translateY(-2px)" : "translateY(0)"
              }}
            >
              Collections
              <div style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "2px",
                background: "linear-gradient(90deg, #d4af37, #800020)",
                transform: hoveredLink === 'collections' ? "scaleX(1)" : "scaleX(0)",
                transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                transformOrigin: "left"
              }}></div>
            </Link>

            {/* Admin Link */}
            {user && user.role === 'admin' && (
              <Link
                to="/admin"
                onMouseEnter={() => setHoveredLink('admin')}
                onMouseLeave={() => setHoveredLink(null)}
                style={{
                  fontSize: "14px",
                  fontWeight: "700",
                  color: hoveredLink === 'admin' ? "#d4af37" : "#800020",
                  textDecoration: "none",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  position: "relative",
                  padding: "8px 12px",
                  background: hoveredLink === 'admin'
                    ? "linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0.25) 100%)"
                    : "transparent",
                  borderRadius: "25px",
                  border: hoveredLink === 'admin' ? "2px solid #d4af37" : "2px solid transparent",
                  transform: hoveredLink === 'admin' ? "translateY(-2px)" : "translateY(0)"
                }}
              >
                Admin
              </Link>
            )}

            {/* Orders Link */}
            <Link
              to="/orders"
              onMouseEnter={() => setHoveredLink('orders')}
              onMouseLeave={() => setHoveredLink(null)}
              style={{
                fontSize: "14px",
                fontWeight: "700",
                color: hoveredLink === 'orders' ? "#d4af37" : "#800020",
                textDecoration: "none",
                textTransform: "uppercase",
                letterSpacing: "2px",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                position: "relative",
                padding: "8px 0",
                transform: hoveredLink === 'orders' ? "translateY(-2px)" : "translateY(0)"
              }}
            >
              Orders
              <div style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "2px",
                background: "linear-gradient(90deg, #d4af37, #800020)",
                transform: hoveredLink === 'orders' ? "scaleX(1)" : "scaleX(0)",
                transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                transformOrigin: "left"
              }}></div>
            </Link>

            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              onMouseEnter={() => setHoveredLink('wishlist')}
              onMouseLeave={() => setHoveredLink(null)}
              style={{
                fontSize: "14px",
                fontWeight: "700",
                color: hoveredLink === 'wishlist' ? "#d4af37" : "#800020",
                textDecoration: "none",
                textTransform: "uppercase",
                letterSpacing: "2px",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                position: "relative",
                padding: "8px 0",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transform: hoveredLink === 'wishlist' ? "translateY(-2px)" : "translateY(0)"
              }}
            >
              Wishlist
              {wishlistCount > 0 && (
                <span style={{
                  position: "absolute",
                  top: "-2px",
                  right: "-18px",
                  background: "linear-gradient(135deg, #800020 0%, #a0153e 100%)",
                  color: "#d4af37",
                  borderRadius: "50%",
                  width: "24px",
                  height: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: "900",
                  border: "2px solid #d4af37",
                  boxShadow: "0 4px 15px rgba(128, 0, 32, 0.4)"
                }}>
                  {wishlistCount}
                </span>
              )}
              <div style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "2px",
                background: "linear-gradient(90deg, #d4af37, #800020)",
                transform: hoveredLink === 'wishlist' ? "scaleX(1)" : "scaleX(0)",
                transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                transformOrigin: "left"
              }}></div>
            </Link>

            {/* Cart Link */}
            <Link
              to="/checkout"
              onMouseEnter={() => setHoveredLink('cart')}
              onMouseLeave={() => setHoveredLink(null)}
              style={{
                fontSize: "14px",
                fontWeight: "700",
                color: hoveredLink === 'cart' ? "#d4af37" : "#800020",
                textDecoration: "none",
                textTransform: "uppercase",
                letterSpacing: "2px",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                position: "relative",
                padding: "8px 0",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transform: hoveredLink === 'cart' ? "translateY(-2px)" : "translateY(0)"
              }}
            >
              Cart
              {cartCount > 0 && (
                <span style={{
                  position: "absolute",
                  top: "-2px",
                  right: "-18px",
                  background: "linear-gradient(135deg, #800020 0%, #a0153e 100%)",
                  color: "#d4af37",
                  borderRadius: "50%",
                  width: "24px",
                  height: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: "900",
                  border: "2px solid #d4af37",
                  boxShadow: "0 4px 15px rgba(128, 0, 32, 0.4)",
                  animation: cartCount > 0 ? "glow 2s ease-in-out infinite" : "none"
                }}>
                  {cartCount}
                </span>
              )}
              <div style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "2px",
                background: "linear-gradient(90deg, #d4af37, #800020)",
                transform: hoveredLink === 'cart' ? "scaleX(1)" : "scaleX(0)",
                transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                transformOrigin: "left"
              }}></div>
            </Link>

            {/* User Section */}
            {user ? (
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                padding: "8px 20px",
                background: "linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(212,175,55,0.15) 100%)",
                borderRadius: "30px",
                border: "1px solid rgba(212,175,55,0.3)"
              }}>
                <Link
                  to="/profile"
                  style={{
                    fontSize: "14px",
                    color: "#800020",
                    fontWeight: "700",
                    letterSpacing: "0.5px",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    transition: "color 0.3s"
                  }}
                  onMouseEnter={(e) => e.target.style.color = "#d4af37"}
                  onMouseLeave={(e) => e.target.style.color = "#800020"}
                >
                  {user.name}
                </Link>
                <button
                  onClick={handleLogout}
                  style={{
                    padding: "12px 32px",
                    fontSize: "13px",
                    fontWeight: "800",
                    color: "#faf8f5",
                    background: "linear-gradient(135deg, #800020 0%, #a0153e 100%)",
                    borderRadius: "50px",
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    boxShadow: "0 6px 20px rgba(128, 0, 32, 0.35)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    border: "2px solid transparent",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "linear-gradient(135deg, #a0153e 0%, #c41e3a 100%)";
                    e.target.style.transform = "translateY(-2px) scale(1.05)";
                    e.target.style.boxShadow = "0 8px 30px rgba(128, 0, 32, 0.5)";
                    e.target.style.borderColor = "#d4af37";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "linear-gradient(135deg, #800020 0%, #a0153e 100%)";
                    e.target.style.transform = "translateY(0) scale(1)";
                    e.target.style.boxShadow = "0 6px 20px rgba(128, 0, 32, 0.35)";
                    e.target.style.borderColor = "transparent";
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                style={{
                  padding: "14px 36px",
                  fontSize: "13px",
                  fontWeight: "800",
                  color: "#faf8f5",
                  background: "linear-gradient(135deg, #800020 0%, #a0153e 100%)",
                  textDecoration: "none",
                  borderRadius: "50px",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  boxShadow: "0 6px 20px rgba(128, 0, 32, 0.35)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  border: "2px solid transparent",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px"
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "linear-gradient(135deg, #a0153e 0%, #c41e3a 100%)";
                  e.target.style.transform = "translateY(-2px) scale(1.05)";
                  e.target.style.boxShadow = "0 8px 30px rgba(128, 0, 32, 0.5)";
                  e.target.style.borderColor = "#d4af37";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "linear-gradient(135deg, #800020 0%, #a0153e 100%)";
                  e.target.style.transform = "translateY(0) scale(1)";
                  e.target.style.boxShadow = "0 6px 20px rgba(128, 0, 32, 0.35)";
                  e.target.style.borderColor = "transparent";
                }}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* Bottom Decorative Line */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "60%",
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)",
          opacity: scrolled ? 0 : 1,
          transition: "opacity 0.4s ease"
        }}></div>
      </nav >
    </>
  );
}
