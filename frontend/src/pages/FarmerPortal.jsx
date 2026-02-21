import { Link } from 'react-router-dom';
import { Tractor, Leaf, MapPin, Star, ArrowRight, CheckCircle, Clock, TrendingUp } from 'lucide-react';

const benefits = [
    { icon: Tractor, title: 'Wide Machinery Selection', desc: 'Access tractors, harvesters, ploughs, seeders and more at affordable daily rates.' },
    { icon: Clock, title: 'Flexible Rental Periods', desc: 'Rent for a day, a week, or an entire season — whatever your crop cycle needs.' },
    { icon: MapPin, title: 'Local Availability', desc: 'Find machinery close to your farm to minimize transportation costs.' },
    { icon: TrendingUp, title: 'Boost Productivity', desc: 'Modern equipment means faster work, bigger yields, and lower labor costs.' },
];

const features = [
    'Browse 100+ machine listings',
    'Online booking & instant confirmation',
    'Secure payment gateway',
    'AI assistant for farming advice',
    'Track your rental history',
    '24/7 customer support',
];

const FarmerPortal = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
            {/* Hero */}
            <div className="bg-gradient-to-r from-green-700 to-emerald-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="flex flex-col md:flex-row items-center gap-10">
                        <div className="flex-1">
                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
                                <Leaf className="h-4 w-4" />
                                Farmer Portal — AgriRental
                            </div>
                            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                                Rent the Right Machine,<br />
                                <span className="text-yellow-300">Grow Smarter</span>
                            </h1>
                            <p className="text-lg text-green-100 mb-8 max-w-lg">
                                Access high-quality agricultural machinery without the burden of ownership.
                                Register as a farmer and start renting today.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    to="/register"
                                    className="flex items-center justify-center gap-2 bg-yellow-400 text-gray-900 font-bold px-8 py-4 rounded-xl hover:bg-yellow-300 transition-all shadow-lg"
                                >
                                    Create Farmer Account
                                    <ArrowRight className="h-5 w-5" />
                                </Link>
                                <Link
                                    to="/login"
                                    className="flex items-center justify-center gap-2 bg-white/20 border-2 border-white/40 font-semibold px-8 py-4 rounded-xl hover:bg-white/30 transition-all backdrop-blur-sm"
                                >
                                    Login to Your Account
                                </Link>
                            </div>
                        </div>
                        <div className="flex-shrink-0 hidden md:block">
                            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                                <Tractor className="h-40 w-40 text-white/80" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Benefits */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Why Farmers Choose AgriRental</h2>
                <p className="text-center text-gray-500 mb-12">Join thousands of farmers already using our platform</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {benefits.map((b, i) => (
                        <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                                <b.icon className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">{b.title}</h3>
                            <p className="text-sm text-gray-500">{b.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Features list + CTA */}
            <div className="bg-green-700 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-8">Everything You Need as a Farmer</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {features.map((f, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <CheckCircle className="h-5 w-5 text-yellow-400 shrink-0" />
                                        <span className="text-green-100">{f}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center">
                            <Star className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold mb-2">Ready to Start?</h3>
                            <p className="text-green-100 mb-6">Create your free farmer account in under 2 minutes</p>
                            <Link
                                to="/register"
                                className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 font-bold px-8 py-3 rounded-xl hover:bg-yellow-300 transition-all"
                            >
                                Get Started Free
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                            <p className="mt-4 text-sm text-green-200">
                                Already registered?{' '}
                                <Link to="/login" className="text-yellow-300 hover:underline font-medium">
                                    Login here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FarmerPortal;
