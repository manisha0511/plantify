/**
 * PLANTIFY FULL-STACK REST API CLIENT
 * Connects the React frontend to the Spring Boot 3 backend.
 * Provides unified authentication, catalog, cart, wishlist, orders, and admin APIs.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

class ApiClient {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  getToken() {
    return localStorage.getItem('plantify_token');
  }

  setToken(token) {
    if (token) {
      localStorage.setItem('plantify_token', token);
    } else {
      localStorage.removeItem('plantify_token');
    }
  }

  getHeaders(isJson = true) {
    const headers = {};
    if (isJson) {
      headers['Content-Type'] = 'application/json';
    }
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = { ...this.getHeaders(options.body !== undefined), ...options.headers };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const errorMessage = data?.message || `Request failed with status ${response.status}`;
        const error = new Error(errorMessage);
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data?.data !== undefined ? data.data : data;
    } catch (err) {
      // Re-throw with formatted message
      throw err;
    }
  }

  // --- AUTHENTICATION APIS ---
  async register(userData) {
    const result = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (result?.token) {
      this.setToken(result.token);
    }
    return result;
  }

  async login(credentials) {
    const result = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (result?.token) {
      this.setToken(result.token);
    }
    return result;
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch (ignored) {
      // Logout succeeds locally regardless of server state
    } finally {
      this.setToken(null);
    }
  }

  async getMe() {
    return this.request('/auth/me');
  }

  // --- USER PROFILE & ADDRESS APIS ---
  async getProfile() {
    return this.request('/users/me');
  }

  async updateProfile(profileData) {
    return this.request('/users/me', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async getAddresses() {
    return this.request('/users/me/addresses');
  }

  async getAddressById(id) {
    return this.request(`/users/me/addresses/${id}`);
  }

  async createAddress(addressData) {
    return this.request('/users/me/addresses', {
      method: 'POST',
      body: JSON.stringify(addressData),
    });
  }

  async updateAddress(id, addressData) {
    return this.request(`/users/me/addresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(addressData),
    });
  }

  async deleteAddress(id) {
    return this.request(`/users/me/addresses/${id}`, {
      method: 'DELETE',
    });
  }

  async setDefaultAddress(id) {
    return this.request(`/users/me/addresses/${id}/default`, {
      method: 'PATCH',
    });
  }

  // --- CATALOG APIS ---
  async getCategories() {
    return this.request('/categories');
  }

  async getProducts(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '' && val !== 'all') {
        query.append(key, val);
      }
    });
    const qs = query.toString() ? `?${query.toString()}` : '';
    return this.request(`/products${qs}`);
  }

  async getProductById(id) {
    return this.request(`/products/${id}`);
  }

  async getProductBySlug(slug) {
    return this.request(`/products/slug/${slug}`);
  }

  async searchProducts(query) {
    return this.request(`/products/search?q=${encodeURIComponent(query)}`);
  }

  // --- CART APIS ---
  async getCart() {
    return this.request('/cart');
  }

  async addToCart(productId, quantity = 1) {
    return this.request('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async updateCartItem(itemId, quantity) {
    return this.request(`/cart/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  }

  async removeCartItem(itemId) {
    return this.request(`/cart/items/${itemId}`, {
      method: 'DELETE',
    });
  }

  async clearCart() {
    return this.request('/cart', {
      method: 'DELETE',
    });
  }

  async mergeGuestCart(items) {
    return this.request('/cart/merge', {
      method: 'POST',
      body: JSON.stringify(items),
    });
  }

  // --- WISHLIST APIS ---
  async getWishlist() {
    return this.request('/wishlist');
  }

  async addToWishlist(productId) {
    return this.request(`/wishlist/items/${productId}`, {
      method: 'POST',
    });
  }

  async removeFromWishlist(productId) {
    return this.request(`/wishlist/items/${productId}`, {
      method: 'DELETE',
    });
  }

  async moveWishlistToCart(productId) {
    return this.request(`/wishlist/items/${productId}/move-to-cart`, {
      method: 'POST',
    });
  }

  // --- ORDERS & CHECKOUT APIS ---
  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getMyOrders() {
    return this.request('/orders/my');
  }

  async getOrderById(id) {
    return this.request(`/orders/${id}`);
  }

  async cancelOrder(id) {
    return this.request(`/orders/${id}/cancel`, {
      method: 'POST',
    });
  }

  // --- ADMIN DASHBOARD APIS ---
  async getAdminStats() {
    return this.request('/admin/dashboard');
  }

  async getAdminProducts() {
    return this.request('/admin/products');
  }

  async createAdminProduct(productData) {
    return this.request('/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateAdminProduct(id, productData) {
    return this.request(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async toggleProductActive(id) {
    return this.request(`/admin/products/${id}/toggle-active`, {
      method: 'PATCH',
    });
  }

  async deleteAdminProduct(id) {
    return this.request(`/admin/products/${id}`, {
      method: 'DELETE',
    });
  }

  async getAdminOrders() {
    return this.request('/admin/orders');
  }

  async getAdminOrderById(id) {
    return this.request(`/admin/orders/${id}`);
  }

  async updateOrderStatus(id, status) {
    return this.request(`/admin/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // --- AI PLANT-CARE ASSISTANT APIS ---
  async getAiStatus() {
    return this.request('/ai/plant-care/status');
  }

  async sendPlantCareChat({ message, plantId, plantName, conversationHistory = [] }) {
    return this.request('/ai/plant-care/chat', {
      method: 'POST',
      body: JSON.stringify({
        message,
        plantId: plantId || null,
        plantName: plantName || null,
        conversationHistory,
      }),
    });
  }

  // --- AI PLANT HEALTH & DISEASE DETECTION API ---
  async analyzePlantHealth({ imageFile, plantId, plantName }) {
    const formData = new FormData();
    formData.append('image', imageFile);
    if (plantId) formData.append('plantId', plantId);
    if (plantName) formData.append('plantName', plantName);

    const url = `${this.baseUrl}/ai/plant-health/analyze`;
    const headers = {};
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const errorMessage = data?.message || `Health analysis failed with status ${response.status}`;
        const error = new Error(errorMessage);
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data?.data !== undefined ? data.data : data;
    } catch (err) {
      throw err;
    }
  }

  // --- PERSONALIZED PLANT CARE & MY PLANTS APIS ---
  async getMyPlants() {
    return this.request('/my-plants');
  }

  async getPlantById(id) {
    return this.request(`/my-plants/${id}`);
  }

  async createPlant(data) {
    return this.request('/my-plants', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePlant(id, data) {
    return this.request(`/my-plants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePlant(id) {
    return this.request(`/my-plants/${id}`, {
      method: 'DELETE',
    });
  }

  async getPlantRecommendations(id) {
    return this.request(`/my-plants/${id}/recommendations`);
  }

  async addCareLog(id, logData) {
    return this.request(`/my-plants/${id}/care-logs`, {
      method: 'POST',
      body: JSON.stringify(logData),
    });
  }

  async getCareLogs(id) {
    return this.request(`/my-plants/${id}/care-logs`);
  }

  async deleteCareLog(id, logId) {
    return this.request(`/my-plants/${id}/care-logs/${logId}`, {
      method: 'DELETE',
    });
  }

  async getCareReminders() {
    return this.request('/my-plants/reminders');
  }

  async updateReminderStatus(id, status) {
    return this.request(`/my-plants/reminders/${id}/status?status=${status}`, {
      method: 'PUT',
    });
  }
}

export const plantifyApi = new ApiClient();
export default plantifyApi;
