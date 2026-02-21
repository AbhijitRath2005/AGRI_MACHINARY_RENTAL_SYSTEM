import api from './api';

export const createMaintenance = async (maintenanceData) => {
    return await api.post('/maintenance', maintenanceData);
};

export const getAllMaintenance = async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return await api.get(`/maintenance?${params}`);
};

export const getMaintenanceById = async (id) => {
    return await api.get(`/maintenance/${id}`);
};

export const updateMaintenanceStatus = async (id, statusData) => {
    return await api.put(`/maintenance/${id}/status`, statusData);
};

export const approveMaintenance = async (id) => {
    return await api.put(`/maintenance/${id}/approve`);
};
