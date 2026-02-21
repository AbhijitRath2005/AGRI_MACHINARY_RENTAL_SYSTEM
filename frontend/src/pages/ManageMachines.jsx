import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Tractor, Plus, Eye, EyeOff, AlertCircle, Loader2, Pencil } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const ManageMachines = () => {
    const { user } = useAuth();
    const [machines, setMachines] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMachines();
    }, []);

    const fetchMachines = async () => {
        try {
            const res = await api.get(`/machines?owner=${user._id}`);
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

    if (loading) return (
        <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                        <Tractor className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">My Machines</h1>
                        <p className="text-sm text-gray-500">{machines.length} machines listed</p>
                    </div>
                </div>
                <Link to="/owner/add-machine" className="btn btn-primary flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Machine
                </Link>
            </div>

            {machines.length === 0 ? (
                <div className="card p-12 text-center">
                    <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No machines yet</h3>
                    <p className="text-gray-400 mb-6">List your first machine to start earning</p>
                    <Link to="/owner/add-machine" className="btn btn-primary inline-flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add Your First Machine
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {machines.map(machine => (
                        <div key={machine._id} className="card card-hover overflow-hidden">
                            <div className="relative h-44 bg-gray-100">
                                <img
                                    src={machine.imageUrl || 'https://via.placeholder.com/400x200?text=Machine'}
                                    alt={machine.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x200?text=Machine'; }}
                                />
                                <div className="absolute top-3 right-3">
                                    <span className={`badge text-xs ${machine.isActive ? 'badge-success' : 'badge-danger'}`}>
                                        {machine.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 mb-1">{machine.name}</h3>
                                <p className="text-sm text-gray-500 mb-1 capitalize">{machine.type}</p>
                                <p className="text-primary-600 font-bold text-lg mb-4">₹{machine.pricePerDay}/day</p>

                                <div className="flex gap-2">
                                    <Link
                                        to={`/machines/${machine._id}`}
                                        className="flex-1 flex items-center justify-center gap-1 py-2 text-sm bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition font-medium"
                                    >
                                        <Pencil className="h-3.5 w-3.5" />
                                        View
                                    </Link>
                                    <button
                                        onClick={() => toggleStatus(machine)}
                                        className={`flex-1 flex items-center justify-center gap-1 py-2 text-sm rounded-lg transition font-medium ${machine.isActive
                                                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                                : 'bg-green-50 text-green-600 hover:bg-green-100'
                                            }`}
                                    >
                                        {machine.isActive
                                            ? <><EyeOff className="h-3.5 w-3.5" /> Deactivate</>
                                            : <><Eye className="h-3.5 w-3.5" /> Activate</>
                                        }
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageMachines;
