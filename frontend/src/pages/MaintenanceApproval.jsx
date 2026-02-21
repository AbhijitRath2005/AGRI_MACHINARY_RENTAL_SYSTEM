import { useState, useEffect } from 'react';
import { Wrench, Loader2, Check, X, Clock, AlertCircle } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const statusConfig = {
    scheduled: { label: 'Scheduled', classes: 'bg-yellow-100 text-yellow-700' },
    'in-progress': { label: 'In Progress', classes: 'bg-blue-100 text-blue-700' },
    completed: { label: 'Completed', classes: 'bg-green-100 text-green-700' },
    cancelled: { label: 'Cancelled', classes: 'bg-red-100 text-red-700' },
};

const MaintenanceApproval = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await api.get('/maintenance');
            setRequests(res.data.data || res.data);
        } catch {
            toast.error('Failed to load maintenance requests');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/maintenance/${id}`, { status });
            setRequests(prev => prev.map(r => r._id === id ? { ...r, status } : r));
            toast.success(`Request marked as ${status}`);
        } catch {
            toast.error('Failed to update request');
        }
    };

    const filtered = requests.filter(r =>
        filter === 'all' || r.status === filter
    );

    const counts = {
        all: requests.length,
        scheduled: requests.filter(r => r.status === 'scheduled').length,
        'in-progress': requests.filter(r => r.status === 'in-progress').length,
        completed: requests.filter(r => r.status === 'completed').length,
    };

    if (loading) return (
        <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Wrench className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Maintenance Requests</h1>
                    <p className="text-sm text-gray-500">{requests.length} total requests</p>
                </div>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex gap-2 mb-6 flex-wrap">
                {['all', 'scheduled', 'in-progress', 'completed'].map(s => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition capitalize ${filter === s
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {s === 'all' ? 'All' : s.replace('-', ' ')} ({counts[s] || 0})
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                    <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-40" />
                    <p>No maintenance requests found</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filtered.map(req => {
                        const sc = statusConfig[req.status] || { label: req.status, classes: 'bg-gray-100 text-gray-600' };
                        return (
                            <div key={req._id} className="card p-5">
                                <div className="flex items-start justify-between gap-4 flex-wrap">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-semibold text-gray-900">
                                                {req.machineId?.name || 'Machine'}
                                            </h3>
                                            <span className={`badge text-xs ${sc.classes}`}>{sc.label}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">
                                            <span className="font-medium">Issue: </span>{req.description || req.issue || 'N/A'}
                                        </p>
                                        <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                                            <span>
                                                <Clock className="h-3 w-3 inline mr-1" />
                                                {req.scheduledDate
                                                    ? new Date(req.scheduledDate).toLocaleDateString('en-IN')
                                                    : new Date(req.createdAt).toLocaleDateString('en-IN')
                                                }
                                            </span>
                                            {req.cost && <span>₹{req.cost} estimated</span>}
                                            {req.technician && <span>Tech: {req.technician}</span>}
                                        </div>
                                    </div>

                                    {req.status !== 'completed' && req.status !== 'cancelled' && (
                                        <div className="flex gap-2 shrink-0">
                                            <button
                                                onClick={() => updateStatus(req._id, 'completed')}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition"
                                            >
                                                <Check className="h-4 w-4" />
                                                Complete
                                            </button>
                                            <button
                                                onClick={() => updateStatus(req._id, 'cancelled')}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 transition"
                                            >
                                                <X className="h-4 w-4" />
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MaintenanceApproval;
