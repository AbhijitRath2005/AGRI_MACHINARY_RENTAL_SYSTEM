import { Filter } from 'lucide-react';

const MachineFilter = ({ filters, setFilters, onApply }) => {
    const machineTypes = ['Tractor', 'Harvester', 'Plough', 'Seeder', 'Sprayer', 'Cultivator', 'Other'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="card p-6 mb-6">
            <div className="flex items-center space-x-2 mb-4">
                <Filter className="h-5 w-5 text-primary-600" />
                <h3 className="text-lg font-semibold">Filters</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select
                        name="type"
                        value={filters.type}
                        onChange={handleChange}
                        className="input"
                    >
                        <option value="">All Types</option>
                        {machineTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
                    <input
                        type="number"
                        name="minPrice"
                        value={filters.minPrice}
                        onChange={handleChange}
                        placeholder="₹ 0"
                        className="input"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
                    <input
                        type="number"
                        name="maxPrice"
                        value={filters.maxPrice}
                        onChange={handleChange}
                        placeholder="₹ 10000"
                        className="input"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                    <input
                        type="text"
                        name="search"
                        value={filters.search}
                        onChange={handleChange}
                        placeholder="Search machines..."
                        className="input"
                    />
                </div>
            </div>

            <div className="mt-4 flex justify-end">
                <button onClick={onApply} className="btn btn-primary">
                    Apply Filters
                </button>
            </div>
        </div>
    );
};

export default MachineFilter;
