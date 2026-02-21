import api from './api';

export const createBooking = async (bookingData) => {
    return await api.post('/bookings', bookingData);
};

export const getUserBookings = async () => {
    return await api.get('/bookings/my-bookings');
};

export const getAllBookings = async () => {
    return await api.get('/bookings');
};

export const getBookingById = async (id) => {
    return await api.get(`/bookings/${id}`);
};

export const updateBookingStatus = async (id, status) => {
    return await api.put(`/bookings/${id}/status`, { status });
};

export const cancelBooking = async (id) => {
    return await api.put(`/bookings/${id}/cancel`);
};
