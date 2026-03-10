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
        try {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (storedToken && storedToken !== 'undefined' && storedUser && storedUser !== 'undefined') {
                const parsedUser = JSON.parse(storedUser);
                if (parsedUser && typeof parsedUser === 'object') {
                    setToken(storedToken);
                    setUser(parsedUser);
                } else {
                    // Invalid data, clear it
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            } else {
                // Clear any invalid stored values
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        } catch (e) {
            console.error('Failed to parse stored auth data:', e);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await loginService(email, password);
            const { user, token } = response.data.data;

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

    const register = async (userData, isFormData = false) => {
        try {
            console.log('📝 Attempting registration...');
            const response = await registerService(userData, isFormData);
            console.log('✅ Registration successful:', response.data);
            const { user, token } = response.data.data;

            setUser(user);
            setToken(token);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            return { success: true };
        } catch (error) {
            console.error('❌ Registration failed:', error);

            let errorMessage = 'Registration failed';

            if (error.response) {
                errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
            } else if (error.request) {
                errorMessage = 'Cannot connect to server. Please ensure the backend is running on http://localhost:5000';
            } else {
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
