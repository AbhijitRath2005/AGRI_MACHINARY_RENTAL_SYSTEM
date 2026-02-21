import { useState, useEffect } from 'react';
import { getDashboardStats, getUserGrowthStats } from '../services/adminService';
import LoadingSpinner from '../components/LoadingSpinner';
import { Users, Tractor, Calendar, DollarSign, Wrench, Leaf, UserCog, Database } from 'lucide-react';
import api from '../services/api';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [userGrowth, setUserGrowth] = useState([]);
    const [farmers, setFarmers] = useState([]);
    const [owners, setOwners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dbLoading, setDbLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        fetchStats();
    }, []);

    useEffect(() => {
        if (activeTab === 'farmers' && farmers.length === 0) fetchUsersByRole('farmer');
        if (activeTab === 'owners' && owners.length === 0) fetchUsersByRole('owner');
    }, [activeTab]);

    const fetchStats = async () => {
        try {
            const [statsRes, growthRes] = await Promise.all([
                getDashboardStats(),
                getUserGrowthStats()
            ]);
            setStats(statsRes.data.data);
            const formattedGrowth = growthRes.data.data.map(item => ({
                name: `${item._id.month}/${item._id.year}`,
                users: item.count
            }));
            setUserGrowth(formattedGrowth);
        } catch {
            console.error('Failed to fetch stats');
        } finally {
            setLoading(false);
        }
    };

    const fetchUsersByRole = async (role) => {
        setDbLoading(true);
        try {
            const res = await api.get(`/admin/users?role=${role}`);
            const users = res.data.data || [];
            if (role === 'farmer') setFarmers(users);
            else setOwners(users);
        } catch {
            console.error(`Failed to fetch ${role}s`);
        } finally {
            setDbLoading(false);
        }
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: BarChart },
        { id: 'farmers', label: 'Farmers DB', icon: Leaf },
        { id: 'owners', label: 'Owners DB', icon: UserCog },
    ];

    if (loading) return <div className="py-12"><LoadingSpinner /></div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                    <Database className="h-5 w-5 text-red-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 border-b border-gray-200">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                                ? 'border-primary-600 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <tab.icon className="h-4 w-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                        <div className="card p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">Total Users</p>
                                    <p className="text-3xl font-bold text-blue-600">{stats?.stats.totalUsers}</p>
                                </div>
                                <Users className="h-12 w-12 text-blue-200" />
                            </div>
                        </div>
                        <div className="card p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">Machines</p>
                                    <p className="text-3xl font-bold text-primary-600">{stats?.stats.totalMachines}</p>
                                </div>
                                <Tractor className="h-12 w-12 text-primary-200" />
                            </div>
                        </div>
                        <div className="card p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">Bookings</p>
                                    <p className="text-3xl font-bold text-purple-600">{stats?.stats.totalBookings}</p>
                                </div>
                                <Calendar className="h-12 w-12 text-purple-200" />
                            </div>
                        </div>
                        <div className="card p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">Revenue</p>
                                    <p className="text-3xl font-bold text-green-600">₹{stats?.stats.totalRevenue}</p>
                                </div>
                                <DollarSign className="h-12 w-12 text-green-200" />
                            </div>
                        </div>
                        <div className="card p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">Maintenance</p>
                                    <p className="text-3xl font-bold text-orange-600">{stats?.stats.pendingMaintenance}</p>
                                </div>
                                <Wrench className="h-12 w-12 text-orange-200" />
                            </div>
                        </div>
                    </div>

                    <div className="card p-6 mb-8">
                        <h2 className="text-xl font-semibold mb-4">User Growth</h2>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={userGrowth} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="users" fill="#3B82F6" name="New Users" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="card p-6">
                        <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Machine</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {stats?.recentBookings.map(booking => (
                                        <tr key={booking._id}>
                                            <td className="px-4 py-3">{booking.userId?.name}</td>
                                            <td className="px-4 py-3">{booking.machineId?.name}</td>
                                            <td className="px-4 py-3">
                                                {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3">₹{booking.totalAmount}</td>
                                            <td className="px-4 py-3">
                                                <span className={`badge ${booking.status === 'confirmed' ? 'badge-success' :
                                                    booking.status === 'pending' ? 'badge-warning' : 'badge-info'}`}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* FARMERS DB TAB */}
            {activeTab === 'farmers' && (
                <div className="card overflow-x-auto">
                    <div className="p-4 border-b border-gray-100 flex items-center gap-2">
                        <Leaf className="h-5 w-5 text-green-600" />
                        <h2 className="font-semibold text-gray-900">Registered Farmers</h2>
                        <span className="ml-auto text-sm text-gray-400">{farmers.length} records</span>
                    </div>
                    {dbLoading ? (
                        <div className="flex justify-center py-10"><LoadingSpinner /></div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">#</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Phone</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Joined</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {farmers.length === 0 ? (
                                    <tr><td colSpan="6" className="text-center py-10 text-gray-400">No registered farmers yet</td></tr>
                                ) : farmers.map((f, i) => (
                                    <tr key={f._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm text-gray-400">{i + 1}</td>
                                        <td className="px-4 py-3 font-medium text-gray-900">{f.name}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{f.email}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{f.phone || '—'}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500">
                                            {new Date(f.createdAt).toLocaleDateString('en-IN')}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`badge text-xs ${f.isActive !== false ? 'badge-success' : 'badge-danger'}`}>
                                                {f.isActive !== false ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {/* OWNERS DB TAB */}
            {activeTab === 'owners' && (
                <div className="card overflow-x-auto">
                    <div className="p-4 border-b border-gray-100 flex items-center gap-2">
                        <UserCog className="h-5 w-5 text-blue-600" />
                        <h2 className="font-semibold text-gray-900">Registered Machinery Owners</h2>
                        <span className="ml-auto text-sm text-gray-400">{owners.length} records</span>
                    </div>
                    {dbLoading ? (
                        <div className="flex justify-center py-10"><LoadingSpinner /></div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">#</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Phone</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Joined</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {owners.length === 0 ? (
                                    <tr><td colSpan="6" className="text-center py-10 text-gray-400">No registered owners yet</td></tr>
                                ) : owners.map((o, i) => (
                                    <tr key={o._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm text-gray-400">{i + 1}</td>
                                        <td className="px-4 py-3 font-medium text-gray-900">{o.name}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{o.email}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{o.phone || '—'}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500">
                                            {new Date(o.createdAt).toLocaleDateString('en-IN')}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`badge text-xs ${o.isActive !== false ? 'badge-success' : 'badge-danger'}`}>
                                                {o.isActive !== false ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
