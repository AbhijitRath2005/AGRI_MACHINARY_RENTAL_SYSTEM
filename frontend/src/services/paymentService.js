import api from './api';

export const createPaymentIntent = async (bookingId) => {
    return await api.post('/payments/create-intent', { bookingId });
};

export const confirmPayment = async (paymentData) => {
    return await api.post('/payments/confirm', paymentData);
};

// Confirm UPI payment - farmer submits UPI transaction reference
export const confirmUpiPayment = async (bookingId, upiRef) => {
    return await api.post('/payments/upi-confirm', { bookingId, upiRef });
};

// Get receipt data for a booking
export const getReceipt = async (bookingId) => {
    return await api.get(`/payments/receipt/${bookingId}`);
};

export const getUserPayments = async () => {
    return await api.get('/payments/my-payments');
};

export const getPaymentById = async (id) => {
    return await api.get(`/payments/${id}`);
};
