import { useState, useEffect } from 'react';
import { getUserBookings } from '../services/bookingService';
import { getUserPayments } from '../services/paymentService';
import LoadingSpinner from '../components/LoadingSpinner';
import { Calendar, CreditCard, Package } from 'lucide-react';

const UserDashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [bookingsRes, paymentsRes] = await Promise.all([
                getUserBookings(),
                getUserPayments()
            ]);
            setBookings(bookingsRes.data.data);
            setPayments(paymentsRes.data.data);
        } catch (error) {
            console.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="py-12"><LoadingSpinner /></div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Total Bookings</p>
                            <p className="text-3xl font-bold text-primary-600">{bookings.length}</p>
                        </div>
                        <Calendar className="h-12 w-12 text-primary-200" />
                    </div>
                </div>
                <div className="card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Active Rentals</p>
                            <p className="text-3xl font-bold text-green-600">
                                {bookings.filter(b => b.status === 'confirmed').length}
                            </p>
                        </div>
                        <Package className="h-12 w-12 text-green-200" />
                    </div>
                </div>
                <div className="card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Total Spent</p>
                            <p className="text-3xl font-bold text-blue-600">
                                ₹{payments.reduce((sum, p) => sum + p.amount, 0)}
                            </p>
                        </div>
                        <CreditCard className="h-12 w-12 text-blue-200" />
                    </div>
                </div>
            </div>

            <div className="card p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">My Bookings</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Machine</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Date</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {bookings.map(booking => (
                                <tr key={booking._id}>
                                    <td className="px-4 py-3">{booking.machineId?.name}</td>
                                    <td className="px-4 py-3">{new Date(booking.startDate).toLocaleDateString()}</td>
                                    <td className="px-4 py-3">{new Date(booking.endDate).toLocaleDateString()}</td>
                                    <td className="px-4 py-3">₹{booking.totalAmount}</td>
                                    <td className="px-4 py-3">
                                        <span className={`badge ${booking.status === 'confirmed' ? 'badge-success' :
                                                booking.status === 'pending' ? 'badge-warning' : 'badge-info'
                                            }`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="card p-6">
                <h2 className="text-xl font-semibold mb-4">Payment History</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {payments.map(payment => (
                                <tr key={payment._id}>
                                    <td className="px-4 py-3 font-mono text-sm">{payment.transactionId}</td>
                                    <td className="px-4 py-3">{new Date(payment.paymentDate).toLocaleDateString()}</td>
                                    <td className="px-4 py-3">₹{payment.amount}</td>
                                    <td className="px-4 py-3">
                                        <span className={`badge ${payment.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                                            {payment.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
