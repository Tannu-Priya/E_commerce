import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Truck, Settings, Clock, X, Package, ShoppingBag, Mail, Phone } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_URL}/orders/myorders`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        console.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': { bg: '#fff3cd', text: '#856404', border: '#ffeaa7' },
      'Processing': { bg: '#cfe2ff', text: '#084298', border: '#b6d4fe' },
      'Shipped': { bg: '#e7d6ff', text: '#6f42c1', border: '#d3b8f5' },
      'Delivered': { bg: '#d1e7dd', text: '#0f5132', border: '#badbcc' },
      'Cancelled': { bg: '#f8d7da', text: '#842029', border: '#f5c2c7' }
    };
    return colors[status] || colors['Pending'];
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Delivered': <Check size={20} />,
      'Shipped': <Truck size={20} />,
      'Processing': <Settings size={20} />,
      'Pending': <Clock size={20} />,
      'Cancelled': <X size={20} />
    };
    return icons[status] || <Package size={20} />;
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--light-bg)', paddingTop: '100px' }}>
        <div style={{ fontSize: '1.5rem', color: 'var(--primary-maroon)' }}>Loading your orders...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--light-bg)', paddingTop: '120px', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h1 style={{
            fontFamily: 'Playfair Display',
            fontSize: '3.5rem',
            color: 'var(--primary-maroon)',
            marginBottom: '0.5rem'
          }}>
            My Orders
          </h1>
          <p style={{ color: '#666', fontSize: '1.2rem' }}>Track and manage your purchases</p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '4rem',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            border: '2px solid var(--border-color)'
          }}>
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center', color: '#800020' }}><ShoppingBag size={80} strokeWidth={1} /></div>
            <h3 style={{
              fontFamily: 'Playfair Display',
              fontSize: '2rem',
              color: 'var(--primary-maroon)',
              marginBottom: '1rem'
            }}>
              No orders yet
            </h3>
            <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '2rem' }}>
              Start shopping and your orders will appear here
            </p>
            <button
              onClick={() => navigate('/products')}
              style={{
                padding: '1rem 3rem',
                background: 'linear-gradient(135deg, var(--primary-maroon) 0%, var(--primary-red) 100%)',
                color: 'var(--accent-gold)',
                border: 'none',
                borderRadius: '50px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                transition: 'all 0.3s ease'
              }}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {orders.map((order) => {
              const statusColors = getStatusColor(order.status);
              return (
                <div key={order._id} style={{
                  background: 'white',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                  border: '2px solid var(--border-color)',
                  transition: 'all 0.3s ease'
                }}>
                  {/* Order Header */}
                  <div style={{
                    background: 'linear-gradient(135deg, var(--cream-dark) 0%, var(--light-bg) 100%)',
                    padding: '1.5rem 2rem',
                    borderBottom: '2px solid var(--border-color)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}>
                    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                      <div>
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#666',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          marginBottom: '0.25rem'
                        }}>
                          Order ID
                        </div>
                        <div style={{
                          fontFamily: 'monospace',
                          fontWeight: '700',
                          color: 'var(--primary-maroon)',
                          fontSize: '1rem'
                        }}>
                          #{order._id.slice(-8)}
                        </div>
                      </div>
                      <div style={{ width: '1px', background: 'var(--border-color)' }}></div>
                      <div>
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#666',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          marginBottom: '0.25rem'
                        }}>
                          Order Date
                        </div>
                        <div style={{ fontWeight: '600', color: 'var(--text-dark)' }}>
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                      <div style={{ width: '1px', background: 'var(--border-color)' }}></div>
                      <div>
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#666',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          marginBottom: '0.25rem'
                        }}>
                          Total Amount
                        </div>
                        <div style={{
                          fontFamily: 'Playfair Display',
                          fontSize: '1.3rem',
                          fontWeight: '700',
                          color: 'var(--primary-maroon)'
                        }}>
                          ₹{order.totalPrice.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '50px',
                      background: statusColors.bg,
                      border: `2px solid ${statusColors.border}`,
                      color: statusColors.text,
                      fontWeight: '700',
                      fontSize: '0.9rem'
                    }}>
                      <span style={{ fontSize: '1.2rem' }}>{getStatusIcon(order.status)}</span>
                      {order.status}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div style={{ padding: '2rem' }}>
                    <h3 style={{
                      fontFamily: 'Playfair Display',
                      fontSize: '1.3rem',
                      color: 'var(--primary-maroon)',
                      marginBottom: '1.5rem'
                    }}>
                      Order Items ({order.orderItems.length})
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                      {order.orderItems.map((item, idx) => (
                        <div key={idx} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '1rem',
                          background: 'var(--light-bg)',
                          borderRadius: '10px',
                          border: '1px solid var(--border-color)'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: 'var(--accent-gold)'
                            }}></div>
                            <div>
                              <div style={{ fontWeight: '600', color: 'var(--text-dark)', marginBottom: '0.25rem' }}>
                                {item.name}
                              </div>
                              <div style={{ fontSize: '0.9rem', color: '#666' }}>
                                Quantity: {item.quantity} {item.size && `• Size: ${item.size}`} {item.color && `• Color: ${item.color}`}
                              </div>
                            </div>
                          </div>
                          <div style={{
                            fontWeight: '700',
                            color: 'var(--primary-maroon)',
                            fontSize: '1.1rem'
                          }}>
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Shipping Address */}
                    <div style={{
                      padding: '1.5rem',
                      background: 'var(--cream-dark)',
                      borderRadius: '10px',
                      marginBottom: '1.5rem'
                    }}>
                      <h4 style={{
                        fontWeight: '700',
                        color: 'var(--primary-maroon)',
                        marginBottom: '0.75rem',
                        fontSize: '1rem'
                      }}>
                        📍 Shipping Address
                      </h4>
                      <p style={{ color: '#666', lineHeight: '1.6' }}>
                        {order.shippingAddress.street}, {order.shippingAddress.city}<br />
                        {order.shippingAddress.state} - {order.shippingAddress.zipCode}<br />
                        {order.shippingAddress.country}
                      </p>
                    </div>

                    {/* Payment Info */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '1rem',
                      background: 'var(--light-bg)',
                      borderRadius: '10px',
                      marginBottom: '1.5rem'
                    }}>
                      <div>
                        <span style={{ color: '#666' }}>Payment Method: </span>
                        <span style={{ fontWeight: '600', color: 'var(--text-dark)' }}>{order.paymentMethod}</span>
                      </div>
                      <div>
                        <span style={{ color: '#666' }}>Payment Status: </span>
                        <span style={{
                          fontWeight: '700',
                          color: order.isPaid ? '#0f5132' : '#856404'
                        }}>
                          {order.isPaid ? <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Check size={16} /> Paid</span> : <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={16} /> Pending</span>}
                        </span>
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div style={{
                      borderTop: '2px solid var(--border-color)',
                      paddingTop: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666' }}>
                        <span>Items Price:</span>
                        <span>₹{order.itemsPrice.toLocaleString('en-IN')}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666' }}>
                        <span>Tax:</span>
                        <span>₹{order.taxPrice.toLocaleString('en-IN')}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666' }}>
                        <span>Shipping:</span>
                        <span>₹{order.shippingPrice.toLocaleString('en-IN')}</span>
                      </div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        paddingTop: '0.75rem',
                        borderTop: '2px solid var(--border-color)',
                        fontFamily: 'Playfair Display',
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        color: 'var(--primary-maroon)'
                      }}>
                        <span>Total:</span>
                        <span>₹{order.totalPrice.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Help Section */}
        <div style={{
          marginTop: '4rem',
          background: 'linear-gradient(135deg, var(--primary-maroon) 0%, var(--primary-red) 100%)',
          borderRadius: '20px',
          padding: '3rem',
          textAlign: 'center',
          color: 'white'
        }}>
          <h3 style={{
            fontFamily: 'Playfair Display',
            fontSize: '2rem',
            marginBottom: '1rem',
            color: 'var(--accent-gold)'
          }}>
            Need Help with Your Order?
          </h3>
          <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.9 }}>
            Our customer support team is here to assist you
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="mailto:support@threadstory.com" style={{
              padding: '1rem 2rem',
              background: 'white',
              color: 'var(--primary-maroon)',
              borderRadius: '50px',
              fontWeight: '600',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <Mail size={18} /> Email Support
            </a>
            <a href="tel:+919876543210" style={{
              padding: '1rem 2rem',
              background: 'transparent',
              color: 'white',
              border: '2px solid white',
              borderRadius: '50px',
              fontWeight: '600',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <Phone size={18} /> Call Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
