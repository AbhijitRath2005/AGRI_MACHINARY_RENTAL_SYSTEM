import { createContext, useState, useContext, useEffect } from 'react';
import { login as loginService, register as registerService } from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for stored auth data on mount
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await loginService(email, password);
            const { user, token } = response.data;

            setUser(user);
            setToken(token);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            return { success: true, user };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const register = async (userData) => {
        try {
            console.log('📝 Attempting registration with data:', { ...userData, password: '[HIDDEN]' });
            const response = await registerService(userData);
            console.log('✅ Registration successful:', response.data);
            const { user, token } = response.data;

            setUser(user);
            setToken(token);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            return { success: true };
        } catch (error) {
            console.error('❌ Registration failed:', error);

            let errorMessage = 'Registration failed';

            if (error.response) {
                // Server responded with an error
                errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
            } else if (error.request) {
                // Request was made but no response received
                errorMessage = 'Cannot connect to server. Please ensure the backend is running on http://localhost:5000';
            } else {
                // Error in setting up the request
                errorMessage = error.message || 'An unexpected error occurred';
            }

            return {
                success: false,
                message: errorMessage
            };
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!token,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
