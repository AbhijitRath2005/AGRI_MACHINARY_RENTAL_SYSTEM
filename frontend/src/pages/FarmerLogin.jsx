import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Leaf, Mail, Lock, Eye, EyeOff, Tractor } from 'lucide-react';

const FarmerLogin = () => {
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
                if (result.user?.role !== 'farmer') {
                    toast.error('Access denied. This portal is for farmers only.');
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.reload();
                } else {
                    toast.success('Welcome back, Farmer!');
                    navigate('/dashboard');
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
        <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-xl mb-4">
                        <Leaf className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Farmer Portal</h1>
                    <p className="text-green-300 mt-2">Login to rent agricultural machinery</p>
                </div>

                {/* Card */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-green-200 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="farmer@example.com"
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-green-400/60 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-green-200 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    required
                                    className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-green-400/60 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400 hover:text-white"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 transition-all duration-200 shadow-lg hover:shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Logging in...' : 'Login to Farmer Portal'}
                        </button>
                    </form>

                    <div className="mt-6 text-center space-y-3">
                        <p className="text-green-200 text-sm">
                            Don't have an account?{' '}
                            <Link to="/farmer-register" className="text-yellow-400 hover:text-yellow-300 font-medium transition">
                                Register here
                            </Link>
                        </p>
                        <div className="flex gap-3 justify-center text-sm">
                            <Link to="/admin-login" className="text-red-400 hover:text-red-300 transition">
                                Admin Portal
                            </Link>
                            <span className="text-green-600">·</span>
                            <Link to="/owner-login" className="text-blue-400 hover:text-blue-300 transition">
                                Owner Portal
                            </Link>
                        </div>
                    </div>
                </div>

                <p className="text-center mt-6">
                    <Link to="/" className="flex items-center justify-center gap-2 text-green-400/60 hover:text-green-300 text-sm transition">
                        <Tractor className="h-4 w-4" />
                        Back to AgriRental Home
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default FarmerLogin;
