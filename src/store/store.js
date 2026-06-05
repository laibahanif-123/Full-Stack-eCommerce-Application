// client/src/store/store.js
import { create } from 'zustand';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sh_token');
  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }
  return config;
});

export const useStore = create((set, get) => ({
  // --- INITIAL DATA STATES ---
  user: null,
  token: localStorage.getItem('sh_token') || null,
  products: [],
  featuredProducts: [],
  currentProduct: null,
  cart: JSON.parse(localStorage.getItem('sh_guest_cart')) || [],
  orders: [],
  wishlist: JSON.parse(localStorage.getItem('sh_wishlist')) || [],
  loading: false,
  authLoading: localStorage.getItem('sh_token') ? true : false,
  error: null,

  // --- GLOBAL STATUS UTILITIES ---
  setLoading: (status) => set({ loading: status }),
  clearErrors: () => set({ error: null }),

  // --- AUTHENTICATION ACTIONS ---
  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, ...userData } = response.data;
      
      localStorage.setItem('sh_token', token);
      set({ user: userData, token, loading: false });
      
      await get().syncCartOnLogin();
    } catch (err) {
      set({ error: err.response?.data?.message || 'Login failed', loading: false });
      throw err;
    }
  },

  signup: async (registrationData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/auth/signup', registrationData);
      const { token, ...userData } = response.data;
      
      localStorage.setItem('sh_token', token);
      set({ user: userData, token, loading: false });
      await get().syncCartOnLogin();
    } catch (err) {
      set({ error: err.response?.data?.message || 'Registration failed', loading: false });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('sh_token');
    localStorage.removeItem('sh_guest_cart');
    set({ user: null, token: null, cart: [] });
  },

  checkAuthStatus: async () => {
    if (!get().token) {
      set({ authLoading: false });
      return;
    }
    set({ authLoading: true });
    try {
      const response = await api.get('/auth/me');
      set({ user: response.data, authLoading: false });
      get().fetchCart();
    } catch (err) {
      get().logout();
      set({ authLoading: false });
    }
  },

  // --- PRODUCT ACTIONS ---
  fetchProducts: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.sort) params.append('sort', filters.sort);

      const response = await api.get(`/products?${params.toString()}`);
      const data = response.data;
      const list = Array.isArray(data) ? data : [];
      set({ products: list, loading: false, error: null });
    } catch (err) {
      console.error('fetchProducts failed:', err.message);
      set({
        error: err.response?.data?.message || 'Cannot connect to server. Make sure backend is running on port 5000.',
        loading: false,
      });
    }
  },

  fetchFeaturedProducts: async () => {
    try {
      const response = await api.get('/products/featured');
      set({ featuredProducts: response.data });
    } catch (err) {
      console.error('Featured products fetch error:', err.message);
    }
  },

  fetchProductDetails: async (productId) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/products/${productId}`);
      set({ currentProduct: response.data, loading: false });
    } catch (err) {
      set({ error: 'Failed to load product details', loading: false });
    }
  },

  // --- WISHLIST ACTIONS ---
  toggleWishlist: (product) => {
    const currentWishlist = [...get().wishlist];
    const exists = currentWishlist.find(item => item._id === product._id);
    let newWishlist;
    if (exists) {
      newWishlist = currentWishlist.filter(item => item._id !== product._id);
    } else {
      newWishlist = [...currentWishlist, product];
    }
    localStorage.setItem('sh_wishlist', JSON.stringify(newWishlist));
    set({ wishlist: newWishlist });
  },

  isInWishlist: (productId) => {
    return get().wishlist.some(item => item._id === productId);
  },

  // --- CART MANAGEMENT ACTIONS ---
  fetchCart: async () => {
    if (!get().user) return;
    try {
      const response = await api.get('/cart');
      const normalizedCart = response.data.map(item => ({
        productId: item.productId?._id || item.productId,
        name: item.productId?.name || 'Unknown Product',
        price: item.productId?.price || 0,
        originalPrice: item.productId?.originalPrice || 0,
        image: item.productId?.image || '',
        category: item.productId?.category || '',
        stock: item.productId?.stock || 0,
        quantity: item.quantity
      }));
      set({ cart: normalizedCart });
    } catch (err) {
      console.error('Cart fetch error:', err.message);
    }
  },

  addToCart: async (product, quantity = 1) => {
    const currentCart = [...get().cart];
    const existingIndex = currentCart.findIndex(item => item.productId === product._id);

    if (existingIndex > -1) {
      currentCart[existingIndex].quantity += quantity;
    } else {
      currentCart.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice || 0,
        image: product.image,
        category: product.category || '',
        stock: product.stock,
        quantity
      });
    }

    set({ cart: currentCart });

    if (get().user) {
      try {
        await api.post('/cart/add', { productId: product._id, quantity });
      } catch (err) {
        console.error('Failed to sync cart to server');
      }
    } else {
      localStorage.setItem('sh_guest_cart', JSON.stringify(currentCart));
    }
  },

  updateCartQuantity: async (productId, quantity) => {
    if (quantity < 1) return;
    const currentCart = get().cart.map(item => 
      item.productId === productId ? { ...item, quantity } : item
    );
    set({ cart: currentCart });

    if (get().user) {
      try {
        await api.put(`/cart/update/${productId}`, { quantity });
      } catch (err) {
        console.error('Failed to update cart quantity');
      }
    } else {
      localStorage.setItem('sh_guest_cart', JSON.stringify(currentCart));
    }
  },

  removeFromCart: async (productId) => {
    const currentCart = get().cart.filter(item => item.productId !== productId);
    set({ cart: currentCart });

    if (get().user) {
      try {
        await api.delete(`/cart/remove/${productId}`);
      } catch (err) {
        console.error('Failed to remove cart item');
      }
    } else {
      localStorage.setItem('sh_guest_cart', JSON.stringify(currentCart));
    }
  },

  syncCartOnLogin: async () => {
    const guestCart = JSON.parse(localStorage.getItem('sh_guest_cart')) || [];
    if (guestCart.length === 0) {
      await get().fetchCart();
      return;
    }

    try {
      for (const item of guestCart) {
        await api.post('/cart/add', { productId: item.productId, quantity: item.quantity });
      }
      localStorage.removeItem('sh_guest_cart');
      await get().fetchCart();
    } catch (err) {
      console.error('Cart sync error:', err.message);
    }
  },

  // --- CHECKOUT OPERATIONS ---
  checkout: async (shippingAddress) => {
    set({ loading: true, error: null });
    try {
      const orderPayload = {
        items: get().cart,
        shippingAddress,
        totalAmount: get().cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      };
      const response = await api.post('/orders', orderPayload);
      
      // Clear database cart on the server
      try {
        await api.delete('/cart/clear');
      } catch (clearErr) {
        console.error('Failed to clear database cart on server:', clearErr.message);
      }
      
      set({ cart: [], loading: false });
      return response.data;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Checkout failed', loading: false });
      throw err;
    }
  },

  // --- ORDER ACTIONS ---
  currentOrder: null,
  fetchOrderById: async (orderId) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/orders/${orderId}`);
      set({ currentOrder: response.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Order not found', loading: false });
    }
  },
  fetchUserOrders: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/orders');
      set({ orders: response.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch orders', loading: false });
    }
  },

  // --- ADMIN PRODUCT CRUD ---
  createProduct: async (productData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/products', productData);
      set((state) => ({
        products: [response.data, ...state.products],
        loading: false
      }));
      return response.data;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Product creation failed', loading: false });
      throw err;
    }
  },

  updateProduct: async (productId, productData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/products/${productId}`, productData);
      set((state) => ({
        products: state.products.map(p => p._id === productId ? response.data : p),
        currentProduct: state.currentProduct?._id === productId ? response.data : state.currentProduct,
        loading: false
      }));
      return response.data;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Product update failed', loading: false });
      throw err;
    }
  },

  deleteProduct: async (productId) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/products/${productId}`);
      set((state) => ({
        products: state.products.filter(p => p._id !== productId),
        loading: false
      }));
    } catch (err) {
      set({ error: err.response?.data?.message || 'Product deletion failed', loading: false });
      throw err;
    }
  }
}));