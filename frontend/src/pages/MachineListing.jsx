import { useState, useEffect } from 'react';
import { getAllMachines } from '../services/machineService';
import MachineCard from '../components/MachineCard';
import MachineFilter from '../components/MachineFilter';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const MachineListing = () => {
    const [machines, setMachines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        type: '',
        minPrice: '',
        maxPrice: '',
        search: '',
        status: 'available'
    });

    const fetchMachines = async () => {
        try {
            setLoading(true);
            const response = await getAllMachines(filters);
            setMachines(response.data.data);
            setError('');
        } catch (err) {
            setError('Failed to load machines');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMachines();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold mb-8">Browse Agricultural Machinery</h1>

            <MachineFilter filters={filters} setFilters={setFilters} onApply={fetchMachines} />

            <ErrorMessage message={error} />

            {loading ? (
                <div className="py-12">
                    <LoadingSpinner />
                </div>
            ) : machines.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-600">No machines found matching your criteria</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {machines.map(machine => (
                        <MachineCard key={machine._id} machine={machine} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MachineListing;
