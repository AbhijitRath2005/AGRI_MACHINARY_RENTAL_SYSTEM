import { useState, useEffect } from 'react';
import { Tractor, Search, Eye, EyeOff, Check, X, Loader2, AlertCircle } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const ManageAllMachines = () => {
    const [machines, setMachines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchMachines();
    }, []);

    const fetchMachines = async () => {
        try {
            const res = await api.get('/machines');
            setMachines(res.data.data || res.data);
        } catch {
            toast.error('Failed to load machines');
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (machine) => {
        try {
            await api.put(`/machines/${machine._id}`, { isActive: !machine.isActive });
            setMachines(prev => prev.map(m =>
                m._id === machine._id ? { ...m, isActive: !m.isActive } : m
            ));
            toast.success(`Machine ${!machine.isActive ? 'activated' : 'deactivated'}`);
        } catch {
            toast.error('Failed to update machine status');
        }
    };

    const filtered = machines.filter(m => {
        const matchSearch = m.name?.toLowerCase().includes(search.toLowerCase()) ||
            m.type?.toLowerCase().includes(search.toLowerCase()) ||
            m.owner?.name?.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === 'all' || (filter === 'active' ? m.isActive : !m.isActive);
        return matchSearch && matchFilter;
    });

    if (loading) return (
        <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                    <Tractor className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">All Machines</h1>
                    <p className="text-sm text-gray-500">{machines.length} machines registered on the platform</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name, type, or owner..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input pl-10"
                    />
                </div>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="input w-full sm:w-40"
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>

            {filtered.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                    <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-40" />
                    <p>No machines found matching your search</p>
                </div>
            ) : (
                <div className="card overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Machine</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Owner</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Price/Day</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.map(machine => (
                                <tr key={machine._id} className="hover:bg-gray-50 transition">
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-gray-900">{machine.name}</div>
                                        <div className="text-xs text-gray-400">{machine.location || '—'}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="badge bg-blue-50 text-blue-700 capitalize">{machine.type}</span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{machine.owner?.name || '—'}</td>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">₹{machine.pricePerDay}/day</td>
                                    <td className="px-4 py-3">
                                        {machine.isActive
                                            ? <span className="badge badge-success">Active</span>
                                            : <span className="badge badge-danger">Inactive</span>
                                        }
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => toggleStatus(machine)}
                                            className={`flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg transition ${machine.isActive
                                                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                                    : 'bg-green-50 text-green-600 hover:bg-green-100'
                                                }`}
                                        >
                                            {machine.isActive
                                                ? <><EyeOff className="h-3 w-3" /> Deactivate</>
                                                : <><Eye className="h-3 w-3" /> Activate</>
                                            }
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ManageAllMachines;
