import api from './api';

export const getDashboardStats = async () => {
    return await api.get('/admin/dashboard');
};

export const getAllUsers = async () => {
    return await api.get('/users');
};

export const manageUser = async (userId, data) => {
    return await api.put(`/admin/users/${userId}`, data);
};

export const getRevenueReport = async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return await api.get(`/admin/revenue?${params}`);
};

export const getUserGrowthStats = async () => {
    return await api.get('/admin/user-growth');
};
