import api from './api';

export const createPaymentIntent = async (bookingId) => {
    return await api.post('/payments/create-intent', { bookingId });
};

export const confirmPayment = async (paymentData) => {
    return await api.post('/payments/confirm', paymentData);
};

export const getUserPayments = async () => {
    return await api.get('/payments/my-payments');
};

export const getPaymentById = async (id) => {
    return await api.get(`/payments/${id}`);
};
