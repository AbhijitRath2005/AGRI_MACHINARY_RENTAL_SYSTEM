import api from './api';

export const getAllMachines = async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return await api.get(`/machines?${params}`);
};

export const getMachineById = async (id) => {
    return await api.get(`/machines/${id}`);
};

export const createMachine = async (machineData) => {
    return await api.post('/machines', machineData);
};

export const updateMachine = async (id, machineData) => {
    return await api.put(`/machines/${id}`, machineData);
};

export const deleteMachine = async (id) => {
    return await api.delete(`/machines/${id}`);
};

export const getMachinesByOwner = async (ownerId) => {
    return await api.get(`/machines/owner/${ownerId}`);
};
