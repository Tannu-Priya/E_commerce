import { useState } from "react";
import { useCart } from "./components/context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "./components/Toast";
import { ShoppingCart, Image as ImageIcon } from 'lucide-react';

export default function Checkout() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    paymentMethod: 'COD'
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.token) {
        showToast('Please login to place order', 'error');
        navigate('/login');
        return;
      }

      const subtotal = getCartTotal();
      const tax = Math.round(subtotal * 0.18);
      const shipping = 100;
      const total = subtotal + tax + shipping;

      const orderData = {
        orderItems: cart.map(item => ({
          product: item._id || item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image || '/images/products/default.jpg',
          size: item.size || 'Free Size',
          color: item.color || 'Default'
        })),
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        paymentMethod: formData.paymentMethod,
        itemsPrice: subtotal,
        taxPrice: tax,
        shippingPrice: shipping,
        totalPrice: total
      };

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (response.ok) {
        if (formData.paymentMethod === 'Online Payment') {
          // Initialize Razorpay
          const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

          if (!res) {
            showToast("Razorpay SDK failed to load. Are you online?", "error");
            return;
          }

          // Fetch Razorpay Key
          const { key } = await fetch('http://localhost:5000/api/config/razorpay').then((r) => r.json());

          // Create Order on Razorpay
          const razorpayOrder = await fetch('http://localhost:5000/api/orders/razorpay', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${user.token}`
            },
            body: JSON.stringify({
              amount: total,
              currency: "INR"
            })
          }).then((r) => r.json());

          const options = {
            key: key,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            name: "Thread Story",
            description: "Purchase of Ethnic Wear",
            image: "https://example.com/logo.png", // You can replace this with your logo
            order_id: razorpayOrder.id,
            handler: async function (response) {
              // Verify Payment
              try {
                const payRes = await fetch(`http://localhost:5000/api/orders/${data._id}/pay`, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                  },
                  body: JSON.stringify({
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature
                  })
                });

                if (payRes.ok) {
                  showToast('Payment successful! Order placed.', 'success');
                  clearCart();
                  navigate('/orders');
                } else {
                  showToast('Payment verification failed', 'error');
                }
              } catch (err) {
                console.error(err);
                showToast('Payment verification failed', 'error');
              }
            },
            prefill: {
              name: user.name,
              email: user.email,
              contact: user.mobile || ""
            },
            theme: {
              color: "#800020"
            }
          };

          const paymentObject = new window.Razorpay(options);
          paymentObject.open();

        } else {
          // COD or other methods
          showToast('Order placed successfully!', 'success');
          clearCart();
          navigate('/orders');
        }
      } else {
        showToast(data.message || 'Failed to place order', 'error');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      showToast('Failed to place order', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px", backgroundColor: "#faf8f5" }}>
        <div style={{ marginBottom: "20px", color: "#800020" }}><ShoppingCart size={80} strokeWidth={1} /></div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "36px", color: "#800020", marginBottom: "15px" }}>Your Cart is Empty</h2>
        <p style={{ color: "#666", marginBottom: "30px", fontSize: "16px" }}>Add some beautiful ethnic wear to your cart!</p>
        <Link to="/products" style={{ padding: "14px 40px", background: "linear-gradient(135deg, #800020 0%, #a0153e 100%)", color: "#d4af37", textDecoration: "none", borderRadius: "50px", fontSize: "14px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1.5px", border: "2px solid #d4af37", transition: "all 0.3s ease" }}>
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (showCheckoutForm) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#faf8f5", padding: "100px 20px 60px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "48px", color: "#800020", marginBottom: "40px", textAlign: "center" }}>Checkout</h1>

          <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "40px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
            <form onSubmit={handleCheckout}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", color: "#800020", marginBottom: "24px" }}>Shipping Address</h2>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#800020" }}>Street Address</label>
                <input
                  type="text"
                  name="street"
                  required
                  value={formData.street}
                  onChange={handleInputChange}
                  style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "2px solid #e8d5c4" }}
                  placeholder="123 Main Street"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#800020" }}>City</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "2px solid #e8d5c4" }}
                    placeholder="Mumbai"
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#800020" }}>State</label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleInputChange}
                    style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "2px solid #e8d5c4" }}
                    placeholder="Maharashtra"
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#800020" }}>ZIP Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    required
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "2px solid #e8d5c4" }}
                    placeholder="400001"
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#800020" }}>Country</label>
                  <input
                    type="text"
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleInputChange}
                    style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "2px solid #e8d5c4" }}
                  />
                </div>
              </div>

              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", color: "#800020", marginBottom: "24px", marginTop: "40px" }}>Payment Method</h2>

              <div style={{ marginBottom: "30px" }}>
                {['COD', 'Online Payment'].map(method => (
                  <label key={method} style={{ display: "flex", alignItems: "center", padding: "16px", border: "2px solid #e8d5c4", borderRadius: "8px", marginBottom: "12px", cursor: "pointer", backgroundColor: formData.paymentMethod === method ? '#fff3cd' : 'white' }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method}
                      checked={formData.paymentMethod === method}
                      onChange={handleInputChange}
                      style={{ marginRight: "12px" }}
                    />
                    <span style={{ fontWeight: "600", color: "#800020" }}>
                      {method === 'Online Payment' ? 'Online Payment (Secure via Razorpay)' : 'Cash on Delivery'}
                    </span>
                  </label>
                ))}
              </div>

              <div style={{ borderTop: "2px solid #e8d5c4", paddingTop: "24px", marginBottom: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                  <span style={{ color: "#666" }}>Subtotal:</span>
                  <span style={{ fontWeight: "600" }}>₹{getCartTotal()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                  <span style={{ color: "#666" }}>Tax (18%):</span>
                  <span style={{ fontWeight: "600" }}>₹{Math.round(getCartTotal() * 0.18)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                  <span style={{ color: "#666" }}>Shipping:</span>
                  <span style={{ fontWeight: "600" }}>₹100</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "24px", marginTop: "16px" }}>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: "700", color: "#800020" }}>Total:</span>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: "700", color: "#800020" }}>₹{getCartTotal() + Math.round(getCartTotal() * 0.18) + 100}</span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px" }}>
                <button
                  type="button"
                  onClick={() => setShowCheckoutForm(false)}
                  style={{ flex: 1, padding: "16px", background: "linear-gradient(135deg, #800020 0%, #a0153e 100%)", color: "#d4af37", border: "2px solid #d4af37", borderRadius: "50px", fontSize: "14px", fontWeight: "700", textTransform: "uppercase", cursor: "pointer" }}
                >
                  Back to Cart
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{ flex: 1, padding: "16px", background: "linear-gradient(135deg, #800020 0%, #a0153e 100%)", color: "#d4af37", border: "2px solid #d4af37", borderRadius: "50px", fontSize: "14px", fontWeight: "700", textTransform: "uppercase", cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </form>          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#faf8f5", padding: "100px 20px 60px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "48px", color: "#800020", marginBottom: "40px", textAlign: "center" }}>Shopping Cart</h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "40px" }}>
          {/* Cart Items */}
          <div>
            {cart.map((item) => (
              <div key={item.id} style={{ backgroundColor: "white", borderRadius: "16px", padding: "24px", marginBottom: "20px", display: "flex", gap: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
                <div style={{ width: "120px", height: "120px", borderRadius: "12px", overflow: "hidden", backgroundColor: "#f5f5f5" }}>
                  {item.image ? (
                    <img 
                      src={item.image.startsWith('http') 
                        ? item.image 
                        : `http://localhost:5000${encodeURI(item.image)}`
                      } 
                      alt={item.name} 
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                    />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#e8d5c4" }}><ImageIcon size={40} strokeWidth={1} /></div>
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", color: "#800020", marginBottom: "8px" }}>{item.name}</h3>
                  <p style={{ color: "#666", fontSize: "14px", marginBottom: "16px" }}>{item.description}</p>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ width: "32px", height: "32px", borderRadius: "8px", border: "2px solid #d4af37", background: "linear-gradient(135deg, #800020 0%, #a0153e 100%)", cursor: "pointer", fontSize: "18px", fontWeight: "700", color: "#d4af37", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                      <span style={{ fontSize: "16px", fontWeight: "600", minWidth: "30px", textAlign: "center" }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ width: "32px", height: "32px", borderRadius: "8px", border: "2px solid #d4af37", background: "linear-gradient(135deg, #800020 0%, #a0153e 100%)", cursor: "pointer", fontSize: "18px", fontWeight: "700", color: "#d4af37", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: "700", color: "#800020" }}>₹{item.price * item.quantity}</span>
                      <button onClick={() => removeFromCart(item.id)} style={{ padding: "8px 16px", background: "linear-gradient(135deg, #800020 0%, #a0153e 100%)", color: "#d4af37", border: "2px solid #d4af37", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}>Remove</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button onClick={clearCart} style={{ padding: "12px 24px", background: "linear-gradient(135deg, #800020 0%, #a0153e 100%)", color: "#d4af37", border: "2px solid #d4af37", borderRadius: "50px", cursor: "pointer", fontSize: "14px", fontWeight: "600", transition: "all 0.3s ease" }}>
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div>
            <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "32px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", position: "sticky", top: "100px" }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", color: "#800020", marginBottom: "24px" }}>Order Summary</h2>

              <div style={{ borderBottom: "1px solid #e8d5c4", paddingBottom: "20px", marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: "15px" }}>
                  <span style={{ color: "#666" }}>Subtotal</span>
                  <span style={{ fontWeight: "600", color: "#800020" }}>₹{getCartTotal()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: "15px" }}>
                  <span style={{ color: "#666" }}>Shipping</span>
                  <span style={{ fontWeight: "600", color: "#28a745" }}>₹100</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "15px" }}>
                  <span style={{ color: "#666" }}>Tax (18%)</span>
                  <span style={{ fontWeight: "600", color: "#800020" }}>₹{Math.round(getCartTotal() * 0.18)}</span>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px", fontSize: "20px" }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: "700", color: "#800020" }}>Total</span>
                <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: "700", color: "#800020" }}>₹{getCartTotal() + Math.round(getCartTotal() * 0.18) + 100}</span>
              </div>

              <button
                onClick={() => setShowCheckoutForm(true)}
                style={{ width: "100%", padding: "16px", background: "linear-gradient(135deg, #800020 0%, #a0153e 100%)", color: "#d4af37", border: "2px solid #d4af37", borderRadius: "50px", fontSize: "14px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px", cursor: "pointer", marginBottom: "12px", transition: "all 0.3s ease" }}
              >
                Proceed to Checkout
              </button>

              <Link to="/products" style={{ display: "block", textAlign: "center", color: "#800020", textDecoration: "none", fontSize: "14px", fontWeight: "600", marginTop: "16px" }}>
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
