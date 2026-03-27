import { useState, useEffect } from 'react';
import { getUserBookings } from '../services/bookingService';
import { getUserPayments } from '../services/paymentService';
import LoadingSpinner from '../components/LoadingSpinner';
import UpiPaymentModal from '../components/UpiPaymentModal';
import ReceiptModal from '../components/ReceiptModal';
import { Calendar, CreditCard, Package, CheckCircle, Clock, Truck, Zap, XCircle, Receipt, IndianRupee } from 'lucide-react';

// Flipkart-style delivery timeline steps
const TIMELINE_STEPS = [
    { key: 'booked', label: 'Booked', icon: Calendar },
    { key: 'payment_received', label: 'Payment Sent', icon: CreditCard },
    { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
    { key: 'dispatched', label: 'Dispatched', icon: Truck },
    { key: 'active', label: 'Active', icon: Zap },
    { key: 'completed', label: 'Completed', icon: Package },
];

const STATUS_ORDER = ['booked', 'payment_received', 'confirmed', 'dispatched', 'active', 'completed'];

const statusColor = (status) => {
    const map = {
        booked: 'bg-blue-100 text-blue-700',
        payment_received: 'bg-yellow-100 text-yellow-700',
        confirmed: 'bg-green-100 text-green-700',
        dispatched: 'bg-purple-100 text-purple-700',
        active: 'bg-emerald-100 text-emerald-700',
        completed: 'bg-gray-100 text-gray-600',
        cancelled: 'bg-red-100 text-red-600',
    };
    return map[status] || 'bg-gray-100 text-gray-600';
};

const payStatusColor = (s) => {
    if (s === 'paid') return 'text-green-600';
    if (s === 'pending_verification') return 'text-amber-500';
    return 'text-red-500';
};

const payStatusLabel = (s) => {
    if (s === 'paid') return '✅ Paid';
    if (s === 'pending_verification') return '⏳ Pending Verification';
    return '⚠️ Unpaid';
};

const UserDashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [payModalBooking, setPayModalBooking] = useState(null);
    const [receiptBookingId, setReceiptBookingId] = useState(null);

    useEffect(() => { fetchData(); }, []);

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

    const handlePaymentSuccess = () => {
        setPayModalBooking(null);
        fetchData(); // refresh bookings
    };

    if (loading) return <div className="py-12"><LoadingSpinner /></div>;

    const totalSpent = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
    const pendingPayments = bookings.filter(b => b.paymentStatus === 'unpaid').length;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Total Bookings', value: bookings.length, color: 'text-primary-600', icon: Calendar, bg: 'text-primary-200' },
                    { label: 'Active Rentals', value: bookings.filter(b => b.status === 'confirmed' || b.deliveryStatus === 'active').length, color: 'text-green-600', icon: Package, bg: 'text-green-200' },
                    { label: 'Total Spent', value: `₹${totalSpent.toLocaleString('en-IN')}`, color: 'text-blue-600', icon: CreditCard, bg: 'text-blue-200' },
                    { label: 'Pending Payment', value: pendingPayments, color: pendingPayments > 0 ? 'text-red-600' : 'text-green-600', icon: IndianRupee, bg: 'text-red-200' },
                ].map((card, i) => (
                    <div key={i} className="card p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">{card.label}</p>
                                <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                            </div>
                            <card.icon className={`h-10 w-10 ${card.bg}`} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Bookings as Cards */}
            <h2 className="text-xl font-semibold mb-4">My Bookings</h2>

            {bookings.length === 0 ? (
                <div className="card p-12 text-center text-gray-400">
                    <Package className="h-16 w-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-medium">No bookings yet</p>
                    <p className="text-sm mt-1">Browse machines and make your first booking!</p>
                </div>
            ) : (
                <div className="space-y-5 mb-8">
                    {bookings.map((booking) => {
                        const machine = booking.machineId;
                        const owner = machine?.ownerId;
                        const isCancelled = booking.deliveryStatus === 'cancelled' || booking.status === 'cancelled';
                        const currentStepIdx = isCancelled ? -1 : STATUS_ORDER.indexOf(booking.deliveryStatus || 'booked');
                        const isUnpaid = booking.paymentStatus === 'unpaid';

                        return (
                            <div key={booking._id} className="card p-0 overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                                {/* Top bar */}
                                <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-mono text-gray-400">#{booking.receiptNumber?.slice(-10) || booking._id?.slice(-8)}</span>
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isCancelled ? 'bg-red-100 text-red-600' : statusColor(booking.deliveryStatus)}`}>
                                            {isCancelled ? '❌ Cancelled' : (booking.deliveryStatus || 'Booked').replace('_', ' ').toUpperCase()}
                                        </span>
                                        <span className={`text-xs font-semibold ${payStatusColor(booking.paymentStatus)}`}>
                                            {payStatusLabel(booking.paymentStatus)}
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-400">{new Date(booking.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                </div>

                                {/* Machine Info */}
                                <div className="flex gap-4 p-5">
                                    {machine?.imageUrl && (
                                        <img src={machine.imageUrl} alt={machine.name} className="w-24 h-20 object-cover rounded-xl shrink-0" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-gray-900 text-lg truncate">{machine?.name || '—'}</h3>
                                        <p className="text-sm text-gray-500">{machine?.type} · {machine?.location}</p>
                                        {owner && (
                                            <p className="text-xs text-gray-400 mt-0.5">Owner: <span className="font-medium text-gray-600">{owner.name}</span> · {owner.phone || owner.email}</p>
                                        )}
                                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                            <span>📅 {new Date(booking.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} → {new Date(booking.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                            <span className="font-bold text-green-700">₹{booking.totalAmount?.toLocaleString('en-IN')}</span>
                                        </div>
                                    </div>
                                    {/* Action Buttons */}
                                    <div className="flex flex-col gap-2 shrink-0">
                                        {isUnpaid && !isCancelled && (
                                            <button
                                                onClick={() => setPayModalBooking(booking)}
                                                className="flex items-center gap-1 bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-green-700 transition-colors"
                                            >
                                                <IndianRupee className="h-4 w-4" /> Pay Now
                                            </button>
                                        )}
                                        {booking.paymentStatus !== 'unpaid' && (
                                            <button
                                                onClick={() => setReceiptBookingId(booking._id)}
                                                className="flex items-center gap-1 bg-gray-100 text-gray-700 text-sm font-semibold px-4 py-2 rounded-xl hover:bg-gray-200 transition-colors"
                                            >
                                                <Receipt className="h-4 w-4" /> Receipt
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Flipkart-style Timeline */}
                                {!isCancelled && (
                                    <div className="px-5 pb-5">
                                        <div className="flex items-center gap-0">
                                            {TIMELINE_STEPS.map((step, idx) => {
                                                const reached = idx <= currentStepIdx;
                                                const isCurrent = idx === currentStepIdx;
                                                const Icon = step.icon;
                                                return (
                                                    <div key={step.key} className="flex items-center flex-1">
                                                        <div className="flex flex-col items-center">
                                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${reached
                                                                    ? isCurrent
                                                                        ? 'border-green-600 bg-green-600 text-white scale-110'
                                                                        : 'border-green-500 bg-green-50 text-green-600'
                                                                    : 'border-gray-200 bg-gray-50 text-gray-300'
                                                                }`}>
                                                                <Icon className="h-3.5 w-3.5" />
                                                            </div>
                                                            <span className={`text-xs mt-1 font-medium whitespace-nowrap ${reached ? 'text-green-700' : 'text-gray-300'} ${isCurrent ? 'font-bold' : ''}`}>
                                                                {step.label}
                                                            </span>
                                                        </div>
                                                        {idx < TIMELINE_STEPS.length - 1 && (
                                                            <div className={`flex-1 h-0.5 mx-1 rounded-full ${idx < currentStepIdx ? 'bg-green-400' : 'bg-gray-200'}`} />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {isCancelled && (
                                    <div className="px-5 pb-4">
                                        <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 rounded-xl px-4 py-2">
                                            <XCircle className="h-4 w-4" />
                                            This booking has been cancelled.
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* UPI Payment Modal */}
            {payModalBooking && (
                <UpiPaymentModal
                    booking={payModalBooking}
                    onSuccess={handlePaymentSuccess}
                    onClose={() => setPayModalBooking(null)}
                />
            )}

            {/* Receipt Modal */}
            {receiptBookingId && (
                <ReceiptModal
                    bookingId={receiptBookingId}
                    onClose={() => setReceiptBookingId(null)}
                />
            )}
        </div>
    );
};

export default UserDashboard;
