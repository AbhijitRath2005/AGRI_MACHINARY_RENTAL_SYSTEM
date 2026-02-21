import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests and log API calls
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log(`🔵 API Request: ${config.method.toUpperCase()} ${config.url}`, config.data);
        return config;
    },
    (error) => {
        console.error('🔴 API Request Error:', error);
        return Promise.reject(error);
    }
);

// Handle response errors with detailed logging
api.interceptors.response.use(
    (response) => {
        console.log(`✅ API Response: ${response.config.method.toUpperCase()} ${response.config.url}`, response.data);
        return response;
    },
    (error) => {
        if (error.response) {
            // Server responded with error
            console.error(`❌ API Error Response (${error.response.status}):`, error.response.data);
        } else if (error.request) {
            // Request made but no response received
            console.error('❌ API No Response - Backend may not be running:', error.message);
            console.error('🔍 Check if backend server is running on:', API_URL);
        } else {
            // Error setting up request
            console.error('❌ API Request Setup Error:', error.message);
        }

        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
