import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createMachine } from '../services/machineService';
import ErrorMessage from '../components/ErrorMessage';

const AddMachine = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '', type: 'Tractor', description: '', pricePerDay: '', imageUrl: '', location: '',
        specifications: { brand: '', model: '', year: '', horsepower: '', fuelType: 'Diesel', condition: 'Good' }
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createMachine(formData);
            navigate('/owner/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add machine');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold mb-8">Add New Machine</h1>
            <div className="card p-8">
                <ErrorMessage message={error} />
                <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div><label className="block text-sm font-medium text-gray-700 mb-2">Machine Name *</label>
                            <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input" /></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                            <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="input">
                                {['Tractor', 'Harvester', 'Plough', 'Seeder', 'Sprayer', 'Cultivator', 'Other'].map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                        <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                            <textarea required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input" rows="3" /></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-2">Price Per Day (₹) *</label>
                            <input type="number" required value={formData.pricePerDay} onChange={(e) => setFormData({ ...formData, pricePerDay: e.target.value })} className="input" /></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                            <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="input" /></div>
                        <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                            <input type="url" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} className="input" /></div>
                    </div>
                    <button type="submit" disabled={loading} className="w-full btn btn-primary py-3">{loading ? 'Adding...' : 'Add Machine'}</button>
                </form>
            </div>
        </div>
    );
};

export default AddMachine;
