import api from './api';

export const login = async (email, password) => {
    return await api.post('/auth/login', { email, password });
};

export const register = async (userData, isFormData = false) => {
    if (isFormData) {
        // For owner registration with file upload (multipart/form-data)
        return await api.post('/auth/register', userData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }
    return await api.post('/auth/register', userData);
};

export const getProfile = async () => {
    return await api.get('/auth/profile');
};
