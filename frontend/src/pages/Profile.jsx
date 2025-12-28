import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from './components/Toast';
import { User, Package, Lock, Edit2, Save, X, ShoppingBag, Crown } from 'lucide-react';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(userData);
    setFormData({ ...formData, name: userData.name, email: userData.email });
    fetchOrders(userData.token);
  }, []);

  const fetchOrders = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/orders/myorders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email
        })
      });

      const data = await response.json();
      if (response.ok) {
        const updatedUser = { ...user, name: data.name, email: data.email };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setEditing(false);
        showToast('Profile updated successfully!', 'success');
      } else {
        showToast(data.message || 'Failed to update profile', 'error');
      }
    } catch (error) {
      showToast('Failed to update profile', 'error');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });

      const data = await response.json();
      if (response.ok) {
        showToast('Password changed successfully!', 'success');
        setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        showToast(data.message || 'Failed to change password', 'error');
      }
    } catch (error) {
      showToast('Failed to change password', 'error');
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#faf8f5' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '1rem', color: '#800020', display: 'flex', justifyContent: 'center' }}><User size={64} strokeWidth={1} /></div>
          <p style={{ fontSize: '1.5rem', color: 'var(--primary-maroon)' }}>Loading Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#faf8f5', paddingTop: '100px', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, var(--primary-maroon) 0%, var(--primary-red) 100%)', borderRadius: '16px', padding: '3rem', marginBottom: '2rem', color: 'white', textAlign: 'center' }}>
          <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}><User size={64} strokeWidth={1} /></div>
          <h1 style={{ fontFamily: 'Playfair Display', fontSize: '3rem', marginBottom: '0.5rem', color: 'var(--accent-gold)' }}>
            {user?.name}
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.95 }}>{user?.email}</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {[
            { id: 'profile', label: 'Profile Info', icon: <User size={20} /> },
            { id: 'orders', label: 'My Orders', icon: <Package size={20} /> },
            { id: 'security', label: 'Security', icon: <Lock size={20} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '1rem 2rem',
                background: activeTab === tab.id ? 'linear-gradient(135deg, var(--primary-maroon) 0%, var(--primary-red) 100%)' : 'white',
                color: activeTab === tab.id ? 'var(--accent-gold)' : 'var(--primary-maroon)',
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
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontFamily: 'Playfair Display', fontSize: '2rem', color: 'var(--primary-maroon)' }}>
                  Profile Information
                </h2>
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    style={{
                      padding: '0.8rem 2rem',
                      background: 'linear-gradient(135deg, var(--primary-maroon) 0%, var(--primary-red) 100%)',
                      color: 'var(--accent-gold)',
                      border: '2px solid var(--accent-gold)',
                      borderRadius: '50px',
                      fontSize: '1rem',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    <Edit2 size={16} /> Edit Profile
                  </button>
                )}
              </div>

              {editing ? (
                <form onSubmit={handleUpdateProfile}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', color: 'var(--primary-maroon)' }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '1rem',
                        border: '2px solid #e8d5c4',
                        borderRadius: '12px',
                        fontSize: '1rem'
                      }}
                      required
                    />
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', color: 'var(--primary-maroon)' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '1rem',
                        border: '2px solid #e8d5c4',
                        borderRadius: '12px',
                        fontSize: '1rem'
                      }}
                      required
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                      type="submit"
                      style={{
                        padding: '1rem 2rem',
                        background: 'linear-gradient(135deg, var(--primary-maroon) 0%, var(--primary-red) 100%)',
                        color: 'var(--accent-gold)',
                        border: '2px solid var(--accent-gold)',
                        borderRadius: '50px',
                        fontSize: '1rem',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      <Save size={16} /> Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false);
                        setFormData({ ...formData, name: user.name, email: user.email });
                      }}
                      style={{
                        padding: '1rem 2rem',
                        background: 'white',
                        color: 'var(--primary-maroon)',
                        border: '2px solid var(--primary-maroon)',
                        borderRadius: '50px',
                        fontSize: '1rem',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      <X size={16} /> Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <div style={{ marginBottom: '1.5rem', padding: '1.5rem', background: '#faf8f5', borderRadius: '12px' }}>
                    <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.3rem' }}>Full Name</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--primary-maroon)' }}>{user?.name}</div>
                  </div>
                  <div style={{ marginBottom: '1.5rem', padding: '1.5rem', background: '#faf8f5', borderRadius: '12px' }}>
                    <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.3rem' }}>Email Address</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--primary-maroon)' }}>{user?.email}</div>
                  </div>
                  <div style={{ padding: '1.5rem', background: '#faf8f5', borderRadius: '12px' }}>
                    <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.3rem' }}>Account Type</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--primary-maroon)', textTransform: 'capitalize' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>{user?.role === 'admin' ? <><Crown size={20} /> Admin</> : <><User size={20} /> Customer</>}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div>
              <h2 style={{ fontFamily: 'Playfair Display', fontSize: '2rem', color: 'var(--primary-maroon)', marginBottom: '2rem' }}>
                My Orders ({orders.length})
              </h2>
              {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                  <div style={{ marginBottom: '1rem', color: '#800020', display: 'flex', justifyContent: 'center' }}><Package size={80} strokeWidth={1} /></div>
                  <h3 style={{ fontSize: '1.5rem', color: 'var(--primary-maroon)', marginBottom: '0.5rem' }}>No orders yet</h3>
                  <p style={{ color: '#666', marginBottom: '2rem' }}>Start shopping to see your orders here!</p>
                  <button
                    onClick={() => navigate('/collections')}
                    style={{
                      padding: '1rem 2rem',
                      background: 'linear-gradient(135deg, var(--primary-maroon) 0%, var(--primary-red) 100%)',
                      color: 'var(--accent-gold)',
                      border: '2px solid var(--accent-gold)',
                      borderRadius: '50px',
                      fontSize: '1rem',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    <ShoppingBag size={20} /> Start Shopping
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {orders.map(order => (
                    <div
                      key={order._id}
                      onClick={() => navigate('/orders')}
                      style={{
                        padding: '1.5rem',
                        border: '2px solid #e8d5c4',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--accent-gold)';
                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(128, 0, 32, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#e8d5c4';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div>
                          <div style={{ fontSize: '0.9rem', color: '#666' }}>Order ID</div>
                          <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--primary-maroon)' }}>
                            #{order._id.slice(-8)}
                          </div>
                        </div>
                        <div style={{
                          padding: '0.5rem 1rem',
                          background: order.status === 'Delivered' ? '#e8f5e9' : '#fff3cd',
                          color: order.status === 'Delivered' ? '#2e7d32' : '#f57c00',
                          borderRadius: '20px',
                          fontSize: '0.9rem',
                          fontWeight: '700'
                        }}>
                          {order.status}
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: '0.9rem', color: '#666' }}>{order.orderItems.length} items</div>
                          <div style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--primary-maroon)' }}>
                            ₹{order.totalPrice}
                          </div>
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#666' }}>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div>
              <h2 style={{ fontFamily: 'Playfair Display', fontSize: '2rem', color: 'var(--primary-maroon)', marginBottom: '2rem' }}>
                Change Password
              </h2>
              <form onSubmit={handleChangePassword}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', color: 'var(--primary-maroon)' }}>
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: '2px solid #e8d5c4',
                      borderRadius: '12px',
                      fontSize: '1rem'
                    }}
                    required
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', color: 'var(--primary-maroon)' }}>
                    New Password
                  </label>
                  <input
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: '2px solid #e8d5c4',
                      borderRadius: '12px',
                      fontSize: '1rem'
                    }}
                    required
                    minLength={6}
                  />
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', color: 'var(--primary-maroon)' }}>
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: '2px solid #e8d5c4',
                      borderRadius: '12px',
                      fontSize: '1rem'
                    }}
                    required
                    minLength={6}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    padding: '1rem 2rem',
                    background: 'linear-gradient(135deg, var(--primary-maroon) 0%, var(--primary-red) 100%)',
                    color: 'var(--accent-gold)',
                    border: '2px solid var(--accent-gold)',
                    borderRadius: '50px',
                    fontSize: '1rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  <Lock size={16} /> Change Password
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
