import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMachineById } from '../services/machineService';
import { createBooking } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import UpiPaymentModal from '../components/UpiPaymentModal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar, IndianRupee, MapPin, Settings, CheckCircle } from 'lucide-react';

const MachineDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const [machine, setMachine] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [bookingData, setBookingData] = useState({
        startDate: null,
        endDate: null,
        notes: ''
    });
    const [totalAmount, setTotalAmount] = useState(0);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [createdBooking, setCreatedBooking] = useState(null); // holds booking after creation
    const [showPayment, setShowPayment] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);

    useEffect(() => {
        fetchMachine();
    }, [id]);

    useEffect(() => {
        if (bookingData.startDate && bookingData.endDate && machine) {
            const days = Math.ceil((bookingData.endDate - bookingData.startDate) / (1000 * 60 * 60 * 24));
            setTotalAmount(days * machine.pricePerDay);
        }
    }, [bookingData.startDate, bookingData.endDate, machine]);

    const fetchMachine = async () => {
        try {
            const response = await getMachineById(id);
            setMachine(response.data.data);
        } catch (err) {
            setError('Failed to load machine details');
        } finally {
            setLoading(false);
        }
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        setBookingLoading(true);
        try {
            const res = await createBooking({
                machineId: machine._id,
                startDate: bookingData.startDate,
                endDate: bookingData.endDate,
                notes: bookingData.notes
            });
            // Show payment modal instead of alert
            setCreatedBooking(res.data.data);
            setShowPayment(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create booking');
        } finally {
            setBookingLoading(false);
        }
    };

    const handlePaymentSuccess = () => {
        setShowPayment(false);
        setBookingSuccess(true);
        setTimeout(() => navigate('/dashboard'), 3500);
    };

    if (loading) return <div className="py-12"><LoadingSpinner /></div>;
    if (!machine) return <div className="py-12 text-center">Machine not found</div>;

    return (
        <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <img src={machine.imageUrl} alt={machine.name} className="w-full h-96 object-cover rounded-xl shadow-lg" />
                        <div className="mt-6 card p-6">
                            <h3 className="text-lg font-semibold mb-4">Specifications</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><span className="text-gray-600">Brand:</span> <span className="font-medium">{machine.specifications?.brand}</span></div>
                                <div><span className="text-gray-600">Model:</span> <span className="font-medium">{machine.specifications?.model}</span></div>
                                <div><span className="text-gray-600">Year:</span> <span className="font-medium">{machine.specifications?.year}</span></div>
                                <div><span className="text-gray-600">Condition:</span> <span className="font-medium">{machine.specifications?.condition}</span></div>
                                <div><span className="text-gray-600">Fuel Type:</span> <span className="font-medium">{machine.specifications?.fuelType}</span></div>
                                {machine.specifications?.horsepower && (
                                    <div><span className="text-gray-600">Power:</span> <span className="font-medium">{machine.specifications.horsepower}</span></div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold mb-4">{machine.name}</h1>
                        <div className="flex items-center space-x-4 mb-6">
                            <span className={`badge ${machine.status === 'available' ? 'badge-success' : 'badge-warning'}`}>
                                {machine.status}
                            </span>
                            <span className="badge badge-info">{machine.type}</span>
                        </div>

                        <p className="text-gray-700 mb-6">{machine.description}</p>

                        <div className="flex items-center text-gray-600 mb-4">
                            <MapPin className="h-5 w-5 mr-2" />
                            <span>{machine.location}</span>
                        </div>

                        <div className="flex items-center text-3xl font-bold text-primary-600 mb-8">
                            <IndianRupee className="h-8 w-8" />
                            <span>{machine.pricePerDay}</span>
                            <span className="text-lg text-gray-500 ml-2">/day</span>
                        </div>

                        {bookingSuccess ? (
                            <div className="card p-6 text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="h-8 w-8 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Booking & Payment Submitted!</h3>
                                <p className="text-gray-500 text-sm mb-4">
                                    Your payment is pending owner verification. Redirecting to your dashboard...
                                </p>
                                <div className="w-full bg-green-100 rounded-full h-2">
                                    <div className="bg-green-500 h-2 rounded-full animate-[grow_3.5s_linear]" style={{ width: '100%', animation: 'none' }} />
                                </div>
                            </div>
                        ) : machine.status === 'available' && (
                            <div className="card p-6">
                                <h3 className="text-xl font-semibold mb-4">Book This Machine</h3>
                                <ErrorMessage message={error} />
                                <form onSubmit={handleBooking} className="space-y-4 mt-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                                        <DatePicker
                                            selected={bookingData.startDate}
                                            onChange={(date) => setBookingData({ ...bookingData, startDate: date })}
                                            minDate={new Date()}
                                            className="input"
                                            placeholderText="Select start date"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                                        <DatePicker
                                            selected={bookingData.endDate}
                                            onChange={(date) => setBookingData({ ...bookingData, endDate: date })}
                                            minDate={bookingData.startDate || new Date()}
                                            className="input"
                                            placeholderText="Select end date"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                                        <textarea
                                            value={bookingData.notes}
                                            onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                                            className="input"
                                            rows="3"
                                            placeholder="Any special requirements..."
                                        />
                                    </div>
                                    {totalAmount > 0 && (
                                        <div className="bg-primary-50 p-4 rounded-lg">
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium">Total Amount:</span>
                                                <span className="text-2xl font-bold text-primary-600 flex items-center">
                                                    <IndianRupee className="h-6 w-6" />
                                                    {totalAmount.toLocaleString('en-IN')}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">You will pay via UPI after confirming the booking</p>
                                        </div>
                                    )}
                                    <button type="submit" disabled={bookingLoading} className="w-full btn btn-primary py-3">
                                        {bookingLoading ? 'Creating Booking...' : '📋 Book & Proceed to Pay'}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* UPI Payment Modal */}
            {showPayment && createdBooking && (
                <UpiPaymentModal
                    booking={createdBooking}
                    onSuccess={handlePaymentSuccess}
                    onClose={() => {
                        setShowPayment(false);
                        navigate('/dashboard');
                    }}
                />
            )}
        </>
    );
};

export default MachineDetail;
