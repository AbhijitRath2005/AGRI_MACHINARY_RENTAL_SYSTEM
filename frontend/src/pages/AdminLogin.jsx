import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Shield, Mail, Lock, Eye, EyeOff, Tractor } from 'lucide-react';

const AdminLogin = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await login(formData.email, formData.password);
            if (result.success) {
                if (result.user?.role !== 'admin') {
                    toast.error('Access denied. This portal is for administrators only.');
                    // Log them back out
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.reload();
                } else {
                    toast.success('Welcome back, Admin!');
                    navigate('/admin/dashboard');
                }
            } else {
                toast.error(result.message || 'Invalid credentials');
            }
        } catch {
            toast.error('Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 shadow-xl mb-4">
                        <Shield className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Admin Portal</h1>
                    <p className="text-gray-400 mt-2">AgriRental System Administration</p>
                </div>

                {/* Card */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8">
                    <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-6">
                        <Shield className="h-5 w-5 text-red-400 shrink-0" />
                        <p className="text-sm text-red-300">Restricted access — Admin credentials only</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Admin Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="admin@agrirental.com"
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    required
                                    className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Authenticating...' : 'Sign In to Admin Portal'}
                        </button>
                    </form>

                    <div className="mt-6 text-center space-y-2">
                        <p className="text-gray-500 text-sm">Not an admin?</p>
                        <div className="flex gap-3 justify-center">
                            <Link to="/farmer-portal" className="text-sm text-green-400 hover:text-green-300 transition">
                                Farmer Portal
                            </Link>
                            <span className="text-gray-600">·</span>
                            <Link to="/owner-portal" className="text-sm text-blue-400 hover:text-blue-300 transition">
                                Owner Portal
                            </Link>
                        </div>
                    </div>
                </div>

                <p className="text-center mt-6">
                    <Link to="/" className="flex items-center justify-center gap-2 text-gray-500 hover:text-gray-300 text-sm transition">
                        <Tractor className="h-4 w-4" />
                        Back to AgriRental Home
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;
