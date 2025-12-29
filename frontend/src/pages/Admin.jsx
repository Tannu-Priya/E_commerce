import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from './components/Toast';
import { DollarSign, Package, Users, ShoppingBag, Clock, CheckCircle, AlertTriangle, Edit, Trash2, Plus, Image as ImageIcon } from 'lucide-react';

export default function Admin() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'saree',
    stock: '',
    sizes: [],
    colors: [],
    image: '/images/products/default.jpg'
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
      navigate('/products');
      return;
    }
    fetchAdminData();
  }, [navigate]);

  const fetchAdminData = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.token) {
      navigate('/login');
      return;
    }
    const token = user.token;
    const headers = { Authorization: `Bearer ${token}` };

    // Helper to catch errors for individual requests
    const fetchSafe = async (url, setter, name) => {
      try {
        const res = await fetch(url, { headers });
        if (res.status === 401 || res.status === 403) {
          throw new Error('Unauthorized');
        }
        if (!res.ok) {
          throw new Error(`Failed to fetch ${name}: ${res.statusText}`);
        }
        const data = await res.json();
        setter(data);
      } catch (error) {
        console.error(`Error fetching ${name}:`, error);
        if (error.message === 'Unauthorized') {
          showToast('Session expired. Please login again.', 'error');
          localStorage.removeItem('user');
          navigate('/login');
        } else {
          showToast(`Failed to load ${name}`, 'error');
        }
      }
    };

    setLoading(true);
    await Promise.allSettled([
      fetchSafe('http://localhost:5000/api/admin/stats', setStats, 'stats'),
      fetchSafe('http://localhost:5000/api/orders', setOrders, 'orders'),
      fetchSafe('http://localhost:5000/api/admin/users', setUsers, 'users'),
      fetchSafe('http://localhost:5000/api/products', setProducts, 'products')
    ]);
    setLoading(false);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = JSON.parse(localStorage.getItem('user')).token;
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchAdminData();
        showToast('Order status updated successfully!', 'success');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      showToast('Failed to update order status', 'error');
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!productForm.name.trim()) {
      showToast('Product name is required', 'error');
      return;
    }
    if (!productForm.description.trim()) {
      showToast('Product description is required', 'error');
      return;
    }
    if (!productForm.price || productForm.price <= 0) {
      showToast('Valid price is required', 'error');
      return;
    }
    if (!productForm.stock || productForm.stock < 0) {
      showToast('Valid stock quantity is required', 'error');
      return;
    }

    try {
      const token = JSON.parse(localStorage.getItem('user')).token;

      if (!token) {
        showToast('Authentication required. Please login again.', 'error');
        navigate('/login');
        return;
      }

      const url = editingProduct
        ? `http://localhost:5000/api/products/${editingProduct._id}`
        : 'http://localhost:5000/api/products';

      const productData = {
        ...productForm,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
        name: productForm.name.trim(),
        description: productForm.description.trim()
      };

      console.log('Submitting product:', editingProduct ? 'UPDATE' : 'CREATE');
      console.log('URL:', url);
      console.log('Product Data being sent:', JSON.stringify(productData, null, 2));
      console.log('Product form state:', JSON.stringify(productForm, null, 2));
      console.log('Editing product:', editingProduct ? JSON.stringify(editingProduct, null, 2) : 'null');

      const response = await fetch(url, {
        method: editingProduct ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });

      const data = await response.json();
      console.log('Response status:', response.status);
      console.log('Response data:', data);

      if (response.ok) {
        showToast(editingProduct ? 'Product updated successfully!' : 'Product added successfully!', 'success');
        setShowProductModal(false);
        setEditingProduct(null);
        setImagePreview('');
        setProductForm({
          name: '',
          description: '',
          price: '',
          category: 'saree',
          stock: '',
          sizes: [],
          colors: [],
          image: '/images/products/default.jpg'
        });
        fetchAdminData();
      } else {
        if (response.status === 401 || response.status === 403) {
          showToast('Authentication failed. Please login again.', 'error');
          navigate('/login');
        } else {
          const errorMessage = data.message || 'Failed to save product';
          console.error('Product save failed:', errorMessage);
          showToast(errorMessage, 'error');
        }
      }
    } catch (error) {
      console.error('Error saving product:', error);
      showToast(`Network error: ${error.message || 'Failed to save product'}`, 'error');
    }
  };

  const handleEditProduct = (product) => {
    console.log('Editing product:', product);
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      sizes: product.sizes || [],
      colors: product.colors || [],
      image: product.image
    });
    setImagePreview(product.image);
    setShowProductModal(true);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image size should be less than 5MB', 'error');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file', 'error');
        return;
      }

      // Show preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload to server
      try {
        const token = JSON.parse(localStorage.getItem('user')).token;
        const formData = new FormData();
        formData.append('image', file);

        showToast('Uploading image...', 'info');

        const response = await fetch('http://localhost:5000/api/upload', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        });

        const data = await response.json();

        if (response.ok) {
          setProductForm({ ...productForm, image: data.imagePath });
          showToast('Image uploaded successfully!', 'success');
        } else {
          showToast(data.message || 'Failed to upload image', 'error');
          setImagePreview('');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        showToast('Failed to upload image', 'error');
        setImagePreview('');
      }
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const token = JSON.parse(localStorage.getItem('user')).token;
      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        showToast('Product deleted!', 'success');
        fetchAdminData();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      showToast('Failed to delete product', 'error');
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '1.5rem', color: 'var(--primary-maroon)' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--light-bg)', paddingTop: '100px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{
            fontFamily: 'Playfair Display',
            color: 'var(--primary-maroon)',
            marginBottom: '0.5rem'
          }}>
            Admin Dashboard
          </h1>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>Manage your Thread Story store</p>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          borderBottom: '2px solid var(--border-color)',
          flexWrap: 'wrap'
        }}>
          {['dashboard', 'orders', 'users', 'products'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: activeTab === tab ? 'linear-gradient(135deg, var(--primary-maroon) 0%, var(--primary-red) 100%)' : 'transparent',
                color: activeTab === tab ? 'var(--accent-gold)' : 'var(--primary-maroon)',
                border: 'none',
                borderRadius: '8px 8px 0 0',
                padding: '1rem 2rem',
                fontSize: '1rem',
                fontWeight: '600',
                textTransform: 'capitalize',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && stats && (
          <div>
            {/* Stats Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem',
              marginBottom: '3rem'
            }}>
              <StatCard title="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} icon={<DollarSign size={40} />} />
              <StatCard title="Total Orders" value={stats.totalOrders} icon={<Package size={40} />} />
              <StatCard title="Total Users" value={stats.totalUsers} icon={<Users size={40} />} />
              <StatCard title="Total Products" value={stats.totalProducts} icon={<ShoppingBag size={40} />} />
              <StatCard title="Pending Orders" value={stats.pendingOrders} icon={<Clock size={40} />} />
              <StatCard title="Delivered Orders" value={stats.deliveredOrders} icon={<CheckCircle size={40} />} />
            </div>

            {/* Recent Orders */}
            <div style={{ marginBottom: '3rem' }}>
              <h2 style={{
                fontFamily: 'Playfair Display',
                color: 'var(--primary-maroon)',
                marginBottom: '1.5rem'
              }}>
                Recent Orders
              </h2>
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}>
                {stats.recentOrders.map(order => (
                  <div key={order._id} style={{
                    padding: '1rem',
                    borderBottom: '1px solid var(--border-color)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}>
                    <div>
                      <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                        {order.user.name}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#666' }}>
                        {order.orderItems.length} items • ₹{order.totalPrice}
                      </div>
                    </div>
                    <span style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      background: getStatusColor(order.status),
                      color: 'white'
                    }}>
                      {order.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Low Stock Products */}
            {stats.lowStockProducts.length > 0 && (
              <div>
                <h2 style={{
                  fontFamily: 'Playfair Display',
                  color: 'var(--primary-maroon)',
                  marginBottom: '1.5rem'
                }}>
                  Low Stock Alert
                </h2>
                <div style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}>
                  {stats.lowStockProducts.map(product => (
                    <div key={product._id} style={{
                      padding: '1rem',
                      borderBottom: '1px solid var(--border-color)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div style={{ fontWeight: '600' }}>{product.name}</div>
                        <div style={{ fontSize: '0.9rem', color: '#666' }}>
                          Category: {product.category}
                        </div>
                      </div>
                      <span style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        background: '#ff4444',
                        color: 'white'
                      }}>
                        Only {product.stock} left
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h2 style={{
              fontFamily: 'Playfair Display',
              color: 'var(--primary-maroon)',
              marginBottom: '1.5rem'
            }}>
              All Orders ({orders.length})
            </h2>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              overflowX: 'auto'
            }}>
              {orders.map(order => (
                <div key={order._id} style={{
                  padding: '1.5rem',
                  borderBottom: '1px solid var(--border-color)',
                  marginBottom: '1rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                        Order #{order._id.slice(-8)}
                      </div>
                      <div style={{ color: '#666', marginBottom: '0.25rem' }}>
                        Customer: {order.user.name} ({order.user.email})
                      </div>
                      <div style={{ color: '#666', marginBottom: '0.25rem' }}>
                        Items: {order.orderItems.length} • Total: ₹{order.totalPrice}
                      </div>
                      <div style={{ color: '#666' }}>
                        Payment: {order.paymentMethod} • {order.isPaid ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={14} /> Paid</span> : <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> Unpaid</span>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '8px',
                          border: '2px solid var(--primary-maroon)',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      <span style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        background: getStatusColor(order.status),
                        color: 'white',
                        textAlign: 'center'
                      }}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>
                    <strong>Shipping Address:</strong> {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <h2 style={{
              fontFamily: 'Playfair Display',
              color: 'var(--primary-maroon)',
              marginBottom: '1.5rem'
            }}>
              All Users ({users.length})
            </h2>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
              {users.map(user => (
                <div key={user._id} style={{
                  padding: '1rem',
                  borderBottom: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>{user.name}</div>
                    <div style={{ color: '#666', fontSize: '0.9rem' }}>{user.email}</div>
                    {user.phone && <div style={{ color: '#666', fontSize: '0.9rem' }}>{user.phone}</div>}
                  </div>
                  <span style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    background: user.role === 'admin' ? 'var(--accent-gold)' : 'var(--primary-maroon)',
                    color: 'white'
                  }}>
                    {user.role.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{
                fontFamily: 'Playfair Display',
                color: 'var(--primary-maroon)',
                margin: 0
              }}>
                All Products ({products.length})
              </h2>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setImagePreview('');
                  setProductForm({
                    name: '',
                    description: '',
                    price: '',
                    category: 'saree',
                    stock: '',
                    sizes: [],
                    colors: [],
                    image: '/images/products/default.jpg'
                  });
                  setShowProductModal(true);
                }}
                style={{
                  padding: '0.75rem 2rem',
                  background: 'linear-gradient(135deg, var(--primary-maroon) 0%, var(--primary-red) 100%)',
                  color: 'var(--accent-gold)',
                  border: 'none',
                  borderRadius: '50px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  display: 'flex', alignItems: 'center', gap: '8px'
                }}
              >
                <Plus size={20} /> Add Product
              </button>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.5rem'
            }}>
              {products.map(product => (
                <div key={product._id} style={{
                  background: 'white',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s ease'
                }}>
                  <div style={{
                    height: '200px',
                    background: 'var(--cream-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}>
                    {product.image && product.image !== '/images/products/default.jpg' ? (
                      <img
                        src={product.image.startsWith('http')
                          ? product.image
                          : `http://localhost:5000${encodeURI(product.image)}`
                        }
                        alt={product.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <span style={{ color: '#e8d5c4' }}><ImageIcon size={48} strokeWidth={1} /></span>
                    )}
                  </div>
                  <div style={{ padding: '1.5rem' }}>
                    <h3 style={{
                      fontFamily: 'Playfair Display',
                      fontSize: '1.2rem',
                      marginBottom: '0.5rem',
                      color: 'var(--primary-maroon)'
                    }}>
                      {product.name}
                    </h3>
                    <div style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                      Category: {product.category}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--primary-maroon)' }}>
                        ₹{product.price}
                      </span>
                      <span style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        background: product.stock > 10 ? '#4CAF50' : product.stock > 0 ? '#ff9800' : '#c62828',
                        color: 'white'
                      }}>
                        Stock: {product.stock}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleEditProduct(product)}
                        style={{
                          flex: 1,
                          padding: '0.5rem',
                          background: 'var(--primary-maroon)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: '600'
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        style={{
                          flex: 1,
                          padding: '0.5rem',
                          background: 'linear-gradient(135deg, #c62828 0%, #d32f2f 100%)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: '600'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '2rem'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h2 style={{
              fontFamily: 'Playfair Display',
              color: 'var(--primary-maroon)',
              marginBottom: '1.5rem'
            }}>
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleProductSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Product Name</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '2px solid var(--border-color)' }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Description</label>
                <textarea
                  required
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '2px solid var(--border-color)', minHeight: '100px' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '2px solid var(--border-color)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Stock</label>
                  <input
                    type="number"
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '2px solid var(--border-color)' }}
                  />
                </div>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Category</label>
                <select
                  value={productForm.category}
                  onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '2px solid var(--border-color)' }}
                >
                  <option value="saree">Saree</option>
                  <option value="kurti">Kurti</option>
                  <option value="lehenga">Lehenga</option>
                </select>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Available Sizes</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'].map(size => (
                    <label key={size} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <input
                        type="checkbox"
                        checked={productForm.sizes.includes(size)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setProductForm({ ...productForm, sizes: [...productForm.sizes, size] });
                          } else {
                            setProductForm({ ...productForm, sizes: productForm.sizes.filter(s => s !== size) });
                          }
                        }}
                      />
                      <span style={{ fontSize: '0.9rem' }}>{size}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Available Colors</label>
                <input
                  type="text"
                  placeholder="Enter colors separated by commas (e.g., Red, Blue, Green)"
                  value={productForm.colors.join(', ')}
                  onChange={(e) => {
                    const colors = e.target.value.split(',').map(color => color.trim()).filter(color => color);
                    setProductForm({ ...productForm, colors });
                  }}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '2px solid var(--border-color)', marginBottom: '0.5rem' }}
                />
                <small style={{ color: '#666', fontSize: '0.8rem' }}>Separate multiple colors with commas</small>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '2px solid var(--border-color)' }}
                />
                {imagePreview && (
                  <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '8px', border: '2px solid var(--border-color)' }}
                    />
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowProductModal(false);
                    setEditingProduct(null);
                    setImagePreview('');
                  }}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: '#ccc',
                    color: '#333',
                    border: 'none',
                    borderRadius: '50px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: 'linear-gradient(135deg, var(--primary-maroon) 0%, var(--primary-red) 100%)',
                    color: 'var(--accent-gold)',
                    border: 'none',
                    borderRadius: '50px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  {editingProduct ? 'Update' : 'Add'} Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, var(--primary-maroon) 0%, var(--primary-red) 100%)',
      borderRadius: '12px',
      padding: '2rem',
      color: 'white',
      boxShadow: '0 4px 15px rgba(128, 0, 32, 0.3)',
      transition: 'transform 0.3s ease',
      cursor: 'pointer'
    }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{icon}</div>
      <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--accent-gold)' }}>
        {value}
      </div>
      <div style={{ fontSize: '1rem', opacity: 0.9 }}>{title}</div>
    </div>
  );
}

function getStatusColor(status) {
  const colors = {
    'Pending': '#ff9800',
    'Processing': '#2196F3',
    'Shipped': '#9C27B0',
    'Delivered': '#4CAF50',
    'Cancelled': '#f44336'
  };
  return colors[status] || '#666';
}
