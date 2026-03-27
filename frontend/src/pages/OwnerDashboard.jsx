import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMachinesByOwner } from '../services/machineService';
import { getAllBookings, updateBookingStatus } from '../services/bookingService';
import LoadingSpinner from '../components/LoadingSpinner';
import ReceiptModal from '../components/ReceiptModal';
import { Tractor, TrendingUp, Calendar, Plus, Receipt, CheckCircle, Truck, Zap, Package } from 'lucide-react';

const deliveryStatusConfig = {
    booked: { label: 'Booked', color: 'bg-blue-100 text-blue-700' },
    payment_received: { label: 'Payment Received', color: 'bg-yellow-100 text-yellow-700' },
    confirmed: { label: 'Confirmed', color: 'bg-green-100 text-green-700' },
    dispatched: { label: 'Dispatched', color: 'bg-purple-100 text-purple-700' },
    active: { label: 'Active / In Use', color: 'bg-emerald-100 text-emerald-700' },
    completed: { label: 'Completed', color: 'bg-gray-100 text-gray-600' },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-600' },
};

// Owner action buttons: what's next in the flow
const nextAction = (booking) => {
    const ds = booking.deliveryStatus;
    const paid = booking.paymentStatus === 'pending_verification' || booking.paymentStatus === 'paid';
    if (ds === 'payment_received' && paid) return { label: '✅ Confirm Booking', nextStatus: 'confirmed', nextDelivery: 'confirmed', btnClass: 'bg-green-600 hover:bg-green-700' };
    if (ds === 'confirmed') return { label: '🚛 Mark Dispatched', nextStatus: 'confirmed', nextDelivery: 'dispatched', btnClass: 'bg-purple-600 hover:bg-purple-700' };
    if (ds === 'dispatched') return { label: '⚡ Mark Active', nextStatus: 'confirmed', nextDelivery: 'active', btnClass: 'bg-emerald-600 hover:bg-emerald-700' };
    if (ds === 'active') return { label: '✔ Mark Completed', nextStatus: 'completed', nextDelivery: 'completed', btnClass: 'bg-gray-700 hover:bg-gray-800' };
    return null;
};

const OwnerDashboard = () => {
    const { user } = useAuth();
    const [machines, setMachines] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [receiptBookingId, setReceiptBookingId] = useState(null);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const [machinesRes, bookingsRes] = await Promise.all([
                getMachinesByOwner(user._id),
                getAllBookings()
            ]);
            setMachines(machinesRes.data.data);
            // Filter bookings to only those for owner's machines
            const myMachineIds = new Set(machinesRes.data.data.map(m => m._id));
            const allBookings = bookingsRes.data.data;
            const myBookings = allBookings.filter(b => myMachineIds.has(b.machineId?._id || b.machineId));
            setBookings(myBookings);
        } catch (error) {
            console.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (bookingId, status, deliveryStatus) => {
        setUpdatingId(bookingId);
        try {
            await updateBookingStatus(bookingId, { status, deliveryStatus });
            await fetchData(); // refresh
        } catch (err) {
            console.error('Failed to update booking status', err);
        } finally {
            setUpdatingId(null);
        }
    };

    const totalEarnings = bookings
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + b.totalAmount, 0);

    const pendingVerification = bookings.filter(b => b.paymentStatus === 'pending_verification').length;

    if (loading) return <div className="py-12"><LoadingSpinner /></div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Owner Dashboard</h1>
                <Link to="/owner/add-machine" className="btn btn-primary flex items-center space-x-2">
                    <Plus className="h-5 w-5" />
                    <span>Add Machine</span>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Total Machines', value: machines.length, color: 'text-primary-600', Icon: Tractor },
                    { label: 'Total Bookings', value: bookings.length, color: 'text-blue-600', Icon: Calendar },
                    { label: 'Total Earnings', value: `₹${totalEarnings.toLocaleString('en-IN')}`, color: 'text-green-600', Icon: TrendingUp },
                    { label: 'Payments to Verify', value: pendingVerification, color: pendingVerification > 0 ? 'text-amber-600' : 'text-green-600', Icon: CheckCircle },
                ].map((card, i) => (
                    <div key={i} className="card p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">{card.label}</p>
                                <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                            </div>
                            <card.Icon className={`h-10 w-10 opacity-20 ${card.color}`} />
                        </div>
                    </div>
                ))}
            </div>

            {/* My Machines */}
            <div className="card p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">My Machines</h2>
                    <Link to="/owner/machines" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                        Manage All →
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {machines.slice(0, 3).map(machine => (
                        <div key={machine._id} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                            <img src={machine.imageUrl} alt={machine.name} className="w-full h-32 object-cover rounded-lg mb-3" />
                            <h3 className="font-semibold mb-1">{machine.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{machine.type}</p>
                            <div className="flex justify-between items-center">
                                <span className="text-primary-600 font-bold">₹{machine.pricePerDay}/day</span>
                                <span className={`badge ${machine.status === 'available' ? 'badge-success' : 'badge-warning'}`}>
                                    {machine.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bookings for My Machines */}
            <h2 className="text-xl font-semibold mb-4">Bookings for Your Machines</h2>
            {bookings.length === 0 ? (
                <div className="card p-10 text-center text-gray-400">
                    <Calendar className="h-14 w-14 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No bookings yet for your machines</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map((booking) => {
                        const machine = booking.machineId;
                        const farmer = booking.userId;
                        const ds = booking.deliveryStatus || 'booked';
                        const dsCfg = deliveryStatusConfig[ds] || deliveryStatusConfig.booked;
                        const action = nextAction(booking);
                        const isCancelled = ds === 'cancelled' || booking.status === 'cancelled';

                        return (
                            <div key={booking._id} className="card p-0 overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
                                {/* Top bar */}
                                <div className="flex flex-wrap items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100 gap-2">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-xs font-mono text-gray-400">#{booking.receiptNumber?.slice(-10) || booking._id?.slice(-8)}</span>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${dsCfg.color}`}>{dsCfg.label}</span>
                                        {booking.paymentStatus === 'pending_verification' && (
                                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">⏳ Payment Pending Verification</span>
                                        )}
                                        {booking.paymentStatus === 'paid' && (
                                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">✅ Payment Verified</span>
                                        )}
                                    </div>
                                    <span className="text-xs text-gray-400">{new Date(booking.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                </div>

                                <div className="flex flex-wrap gap-4 p-5">
                                    {/* Machine thumb */}
                                    {machine?.imageUrl && (
                                        <img src={machine.imageUrl} alt={machine?.name} className="w-20 h-16 object-cover rounded-xl shrink-0" />
                                    )}

                                    {/* Booking info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-gray-900">{machine?.name || '—'} <span className="text-gray-400 font-normal text-sm">({machine?.type})</span></h3>
                                        <p className="text-sm text-gray-500 mt-0.5">
                                            👨‍🌾 <strong>{farmer?.name}</strong> · {farmer?.email} · {farmer?.phone || '—'}
                                        </p>
                                        <div className="flex flex-wrap gap-4 mt-1.5 text-sm text-gray-600">
                                            <span>📅 {new Date(booking.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} → {new Date(booking.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                            <span>📆 {booking.totalDays} days</span>
                                            <span className="font-bold text-green-700">₹{booking.totalAmount?.toLocaleString('en-IN')}</span>
                                        </div>
                                        {booking.upiRef && (
                                            <p className="text-xs text-gray-400 mt-1">UPI Ref: <span className="font-mono text-gray-600">{booking.upiRef}</span></p>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col gap-2 shrink-0 items-end">
                                        {!isCancelled && action && (
                                            <button
                                                onClick={() => handleStatusUpdate(booking._id, action.nextStatus, action.nextDelivery)}
                                                disabled={updatingId === booking._id}
                                                className={`text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors disabled:opacity-50 ${action.btnClass}`}
                                            >
                                                {updatingId === booking._id ? '⏳ Updating...' : action.label}
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
                            </div>
                        );
                    })}
                </div>
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

export default OwnerDashboard;
