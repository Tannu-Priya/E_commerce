const API_URL = 'http://localhost:5000/api';

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Auth headers
const authHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const api = {
  // Auth APIs
  register: async (userData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await response.json();
    if (response.ok && data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
    }
    return data;
  },

  login: async (credentials) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await response.json();
    if (response.ok && data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getProfile: async () => {
    const response = await fetch(`${API_URL}/auth/profile`, {
      headers: { ...authHeaders() }
    });
    return await response.json();
  },

  updateProfile: async (userData) => {
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders()
      },
      body: JSON.stringify(userData)
    });
    return await response.json();
  },

  // Product APIs
  getProducts: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_URL}/products?${queryString}`);
    return await response.json();
  },

  getProduct: async (id) => {
    const response = await fetch(`${API_URL}/products/${id}`);
    return await response.json();
  },

  createProduct: async (productData) => {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders()
      },
      body: JSON.stringify(productData)
    });
    return await response.json();
  },

  updateProduct: async (id, productData) => {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders()
      },
      body: JSON.stringify(productData)
    });
    return await response.json();
  },

  deleteProduct: async (id) => {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: { ...authHeaders() }
    });
    return await response.json();
  },

  // Order APIs
  createOrder: async (orderData) => {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders()
      },
      body: JSON.stringify(orderData)
    });
    return await response.json();
  },

  getMyOrders: async () => {
    const response = await fetch(`${API_URL}/orders/myorders`, {
      headers: { ...authHeaders() }
    });
    return await response.json();
  },

  getOrder: async (id) => {
    const response = await fetch(`${API_URL}/orders/${id}`, {
      headers: { ...authHeaders() }
    });
    return await response.json();
  },

  getAllOrders: async () => {
    const response = await fetch(`${API_URL}/orders`, {
      headers: { ...authHeaders() }
    });
    return await response.json();
  },

  updateOrderStatus: async (id, status) => {
    const response = await fetch(`${API_URL}/orders/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders()
      },
      body: JSON.stringify({ status })
    });
    return await response.json();
  },

  markOrderDelivered: async (id) => {
    const response = await fetch(`${API_URL}/orders/${id}/deliver`, {
      method: 'PUT',
      headers: { ...authHeaders() }
    });
    return await response.json();
  }
};

export default api;
