import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Tractor, User, LogOut, Menu, X, Shield, Leaf, Wrench, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const portalLinks = [
    {
        label: 'Admin Portal',
        to: '/admin-login',
        icon: Shield,
        color: 'text-red-600',
        hoverBg: 'hover:bg-red-50',
        desc: 'System administration'
    },
    {
        label: 'Farmer Portal',
        to: '/farmer-portal',
        icon: Leaf,
        color: 'text-green-600',
        hoverBg: 'hover:bg-green-50',
        desc: 'Rent machinery'
    },
    {
        label: 'Owner Portal',
        to: '/owner-portal',
        icon: Wrench,
        color: 'text-blue-600',
        hoverBg: 'hover:bg-blue-50',
        desc: 'List your machines'
    },
];

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [portalDropdownOpen, setPortalDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setPortalDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const renderNavLinks = (isMobile = false) => {
        const baseClasses = isMobile
            ? "block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
            : "text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition";

        if (!isAuthenticated) {
            return (
                <>
                    <Link to="/machines" className={baseClasses}>
                        Browse Machines
                    </Link>
                    {isMobile && (
                        <>
                            {portalLinks.map((p) => (
                                <Link key={p.to} to={p.to} className={`block px-3 py-2 rounded-md text-base font-medium ${p.color} hover:bg-gray-50`}>
                                    {p.label}
                                </Link>
                            ))}
                            <Link to="/login" className={baseClasses}>Login</Link>
                            <Link to="/register" className={baseClasses}>Register</Link>
                        </>
                    )}
                </>
            );
        }

        switch (user?.role) {
            case 'admin':
                return (
                    <>
                        <Link to="/admin/dashboard" className={baseClasses}>Admin Dashboard</Link>
                        <Link to="/admin/users" className={baseClasses}>Manage Users</Link>
                        <Link to="/admin/machines" className={baseClasses}>All Machines</Link>
                        <Link to="/admin/maintenance" className={baseClasses}>Maintenance</Link>
                    </>
                );
            case 'owner':
                return (
                    <>
                        <Link to="/owner/dashboard" className={baseClasses}>Owner Dashboard</Link>
                        <Link to="/owner/machines" className={baseClasses}>My Machines</Link>
                        <Link to="/owner/add-machine" className={baseClasses}>Add Machine</Link>
                    </>
                );
            case 'farmer':
            default:
                return (
                    <>
                        <Link to="/dashboard" className={baseClasses}>My Dashboard</Link>
                        <Link to="/machines" className={baseClasses}>Browse Machines</Link>
                    </>
                );
        }
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Brand */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <Tractor className="h-8 w-8 text-primary-600" />
                            <span className="text-xl font-bold text-gray-900">AgriRental</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-2">
                        {renderNavLinks(false)}

                        {/* Portal dropdown — only when not logged in */}
                        {!isAuthenticated && (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    id="portal-dropdown-btn"
                                    onClick={() => setPortalDropdownOpen(!portalDropdownOpen)}
                                    className="flex items-center gap-1 text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition border border-gray-200 hover:border-primary-300"
                                >
                                    Portals
                                    <ChevronDown className={`h-4 w-4 transition-transform ${portalDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {portalDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                                        {portalLinks.map((p) => (
                                            <Link
                                                key={p.to}
                                                to={p.to}
                                                onClick={() => setPortalDropdownOpen(false)}
                                                className={`flex items-center gap-3 px-4 py-3 ${p.hoverBg} transition`}
                                            >
                                                <p.icon className={`h-5 w-5 ${p.color}`} />
                                                <div>
                                                    <div className={`text-sm font-semibold ${p.color}`}>{p.label}</div>
                                                    <div className="text-xs text-gray-400">{p.desc}</div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {!isAuthenticated ? (
                            <>
                                <Link to="/login" className="btn btn-secondary text-sm">Login</Link>
                                <Link to="/register" className="btn btn-primary text-sm">Register</Link>
                            </>
                        ) : (
                            <div className="flex items-center space-x-2 border-l pl-4 ml-4">
                                <div className="flex items-center space-x-2">
                                    <User className="h-5 w-5 text-gray-600" />
                                    <span className="text-sm text-gray-700">{user?.name}</span>
                                    <span className={`text-xs px-2 py-1 rounded-full capitalize font-medium ${user?.role === 'admin' ? 'bg-red-100 text-red-700' :
                                            user?.role === 'owner' ? 'bg-blue-100 text-blue-700' :
                                                'bg-green-100 text-green-700'
                                        }`}>
                                        {user?.role}
                                    </span>
                                </div>
                                <button onClick={logout} className="btn btn-secondary flex items-center space-x-1 ml-2 text-sm">
                                    <LogOut className="h-4 w-4" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-700">
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white border-t">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {renderNavLinks(true)}

                        {isAuthenticated && (
                            <div className="pt-4 border-t border-gray-200 mt-2">
                                <div className="flex items-center px-3 mb-3">
                                    <User className="h-8 w-8 text-gray-600 bg-gray-100 rounded-full p-1" />
                                    <div className="ml-3">
                                        <div className="text-base font-medium text-gray-800">{user?.name}</div>
                                        <div className="text-sm font-medium text-gray-500 capitalize">{user?.role}</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        logout();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-100"
                                >
                                    Sign out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
