import { Link } from 'react-router-dom';
import { Wrench, DollarSign, BarChart2, Star, ArrowRight, CheckCircle, Users, Shield } from 'lucide-react';

const benefits = [
    { icon: DollarSign, title: 'Earn Passive Income', desc: 'Your idle machinery earns rent 24/7 while you retain full ownership.' },
    { icon: Users, title: 'Reach More Farmers', desc: 'Get access to a large farmer network actively looking to rent equipment.' },
    { icon: Shield, title: 'Secure Transactions', desc: 'All payments are secured and processed automatically to your account.' },
    { icon: BarChart2, title: 'Track Performance', desc: 'View real-time booking stats, revenue, and machine utilization in your dashboard.' },
];

const features = [
    'List unlimited machines',
    'Set your own pricing & availability',
    'Real-time booking notifications',
    'Auto revenue tracking',
    'Maintenance request management',
    'Verified farmer matches only',
];

const MachineryOwnerPortal = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            {/* Hero */}
            <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="flex flex-col md:flex-row items-center gap-10">
                        <div className="flex-1">
                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
                                <Wrench className="h-4 w-4" />
                                Machinery Owner Portal — AgriRental
                            </div>
                            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                                Turn Your Machines<br />
                                <span className="text-yellow-300">Into Revenue</span>
                            </h1>
                            <p className="text-lg text-blue-100 mb-8 max-w-lg">
                                List your agricultural machinery and earn money when it's not in use.
                                Join a trusted network of equipment providers serving thousands of farmers.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    to="/register"
                                    className="flex items-center justify-center gap-2 bg-yellow-400 text-gray-900 font-bold px-8 py-4 rounded-xl hover:bg-yellow-300 transition-all shadow-lg"
                                >
                                    Register as Owner
                                    <ArrowRight className="h-5 w-5" />
                                </Link>
                                <Link
                                    to="/login"
                                    className="flex items-center justify-center gap-2 bg-white/20 border-2 border-white/40 font-semibold px-8 py-4 rounded-xl hover:bg-white/30 transition-all backdrop-blur-sm"
                                >
                                    Login to Dashboard
                                </Link>
                            </div>
                        </div>
                        <div className="flex-shrink-0 hidden md:block">
                            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                                <Wrench className="h-40 w-40 text-white/80" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Benefits */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Why List with AgriRental?</h2>
                <p className="text-center text-gray-500 mb-12">Machinery owners trust us to connect them with genuine renters</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {benefits.map((b, i) => (
                        <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                                <b.icon className="h-6 w-6 text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">{b.title}</h3>
                            <p className="text-sm text-gray-500">{b.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* How it works */}
            <div className="bg-blue-700 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-8">What You Get as an Owner</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {features.map((f, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <CheckCircle className="h-5 w-5 text-yellow-400 shrink-0" />
                                        <span className="text-blue-100">{f}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center">
                            <Star className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold mb-2">Start Earning Today</h3>
                            <p className="text-blue-100 mb-6">Register your account and list your first machine in minutes</p>
                            <Link
                                to="/register"
                                className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 font-bold px-8 py-3 rounded-xl hover:bg-yellow-300 transition-all"
                            >
                                List My Machine
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                            <p className="mt-4 text-sm text-blue-200">
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

export default MachineryOwnerPortal;
