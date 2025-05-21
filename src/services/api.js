import axios from 'axios';

// Base API configuration
const BASE_URL = 'http://192.168.29.146:5000';

// Create axios instance with common config
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  async (config) => {
    // You can add token from AsyncStorage here if needed
    // const token = await AsyncStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error);
    
    // You can handle specific error statuses here
    if (error.response) {
      // Server responded with a status code outside the 2xx range
      console.log('Error status:', error.response.status);
      console.log('Error data:', error.response.data);
      
      // Handle authentication errors
      if (error.response.status === 401) {
        // Handle unauthorized
        // redirect to login or refresh token
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.log('No response received:', error.request);
    }
    
    return Promise.reject(error);
  }
);

// API endpoints
export const fetchProducts = async () => {
  try {
    return await api.get('/products');
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
};

export const fetchProductById = async (productId) => {
  try {
    return await api.get(`/products/${productId}`);
  } catch (error) {
    console.error(`Failed to fetch product with ID ${productId}:`, error);
    throw error;
  }
};

export const createBid = async (bidData) => {
  try {
    return await api.post('/bids', bidData);
  } catch (error) {
    console.error('Failed to create bid:', error);
    throw error;
  }
};

export const fetchUserProfile = async (userId) => {
  try {
    return await api.get(`/users/${userId}`);
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId, userData) => {
  try {
    return await api.put(`/users/${userId}`, userData);
  } catch (error) {
    console.error('Failed to update user profile:', error);
    throw error;
  }
};

// Function to upload product images
export const uploadProductImages = async (formData) => {
  try {
    return await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (error) {
    console.error('Failed to upload images:', error);
    throw error;
  }
};

// Utility function to get full image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  return `${BASE_URL}/uploads/${imagePath}`;
};

export default api;