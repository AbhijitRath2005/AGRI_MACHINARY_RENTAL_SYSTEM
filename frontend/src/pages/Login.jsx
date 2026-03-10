import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';
import { LogIn } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(formData.email, formData.password);

        if (result.success) {
            // Redirect based on role
            switch (result.user.role) {
                case 'admin':
                    navigate('/admin/dashboard');
                    break;
                case 'owner':
                    navigate('/owner/dashboard');
                    break;
                case 'farmer':
                    navigate('/dashboard');
                    break;
                default:
                    navigate('/');
            }
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                <div className="card p-8">
                    <div className="text-center mb-8">
                        <LogIn className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                        <h2 className="text-3xl font-bold text-gray-900">Login</h2>
                        <p className="text-gray-600 mt-2">Welcome back to AgriRental</p>
                    </div>

                    <ErrorMessage message={error} />

                    <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="input"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="input"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn btn-primary py-3"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                            Register here
                        </Link>
                    </p>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-blue-900 mb-2">Demo Credentials:</p>
                        <p className="text-xs text-blue-800">Admin: abhijitsince2005@gmail.com / Abhijit@2005</p>
                        <p className="text-xs text-blue-800">Owner: rajesh@example.com / owner123</p>
                        <p className="text-xs text-blue-800">Farmer: amit@example.com / farmer123</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
