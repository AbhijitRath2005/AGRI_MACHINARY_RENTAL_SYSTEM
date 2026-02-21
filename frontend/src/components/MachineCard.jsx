import { Link } from 'react-router-dom';
import { Calendar, IndianRupee, MapPin } from 'lucide-react';

const MachineCard = ({ machine }) => {
    const getStatusBadge = (status) => {
        const badges = {
            available: 'badge-success',
            rented: 'badge-warning',
            maintenance: 'badge-danger'
        };
        return badges[status] || 'badge-info';
    };

    return (
        <div className="card card-hover">
            <div className="relative h-48 overflow-hidden">
                <img
                    src={machine.imageUrl}
                    alt={machine.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute top-3 right-3">
                    <span className={`badge ${getStatusBadge(machine.status)}`}>
                        {machine.status}
                    </span>
                </div>
            </div>

            <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{machine.name}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{machine.description}</p>

                <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span className="badge badge-info">{machine.type}</span>
                    </div>
                    {machine.location && (
                        <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span>{machine.location}</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center text-primary-600 font-bold text-lg">
                        <IndianRupee className="h-5 w-5" />
                        <span>{machine.pricePerDay}</span>
                        <span className="text-sm text-gray-500 ml-1">/day</span>
                    </div>
                    <Link
                        to={`/machines/${machine._id}`}
                        className="btn btn-primary text-sm"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default MachineCard;
