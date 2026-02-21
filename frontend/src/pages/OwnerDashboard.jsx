import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMachinesByOwner } from '../services/machineService';
import { getAllBookings } from '../services/bookingService';
import LoadingSpinner from '../components/LoadingSpinner';
import { Tractor, TrendingUp, Calendar, Plus } from 'lucide-react';

const OwnerDashboard = () => {
    const { user } = useAuth();
    const [machines, setMachines] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [machinesRes, bookingsRes] = await Promise.all([
                getMachinesByOwner(user._id),
                getAllBookings()
            ]);
            setMachines(machinesRes.data.data);
            setBookings(bookingsRes.data.data);
        } catch (error) {
            console.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const totalEarnings = bookings
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + b.totalAmount, 0);

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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Total Machines</p>
                            <p className="text-3xl font-bold text-primary-600">{machines.length}</p>
                        </div>
                        <Tractor className="h-12 w-12 text-primary-200" />
                    </div>
                </div>
                <div className="card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Total Bookings</p>
                            <p className="text-3xl font-bold text-blue-600">{bookings.length}</p>
                        </div>
                        <Calendar className="h-12 w-12 text-blue-200" />
                    </div>
                </div>
                <div className="card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Total Earnings</p>
                            <p className="text-3xl font-bold text-green-600">₹{totalEarnings}</p>
                        </div>
                        <TrendingUp className="h-12 w-12 text-green-200" />
                    </div>
                </div>
            </div>

            <div className="card p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">My Machines</h2>
                    <Link to="/owner/machines" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                        Manage All →
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {machines.slice(0, 3).map(machine => (
                        <div key={machine._id} className="border rounded-lg p-4">
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

            <div className="card p-6">
                <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Machine</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {bookings.slice(0, 5).map(booking => (
                                <tr key={booking._id}>
                                    <td className="px-4 py-3">{booking.machineId?.name}</td>
                                    <td className="px-4 py-3">{booking.userId?.name}</td>
                                    <td className="px-4 py-3">
                                        {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                                    </td>
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
        </div>
    );
};

export default OwnerDashboard;
