import { Link } from 'react-router-dom';
import { Tractor, Shield, Clock, TrendingUp } from 'lucide-react';

const Home = () => {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
                            Agricultural Machinery Rental Platform
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-primary-100">
                            Rent quality farming equipment at affordable rates
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/machines" className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg">
                                Browse Machines
                            </Link>
                            <Link to="/register" className="btn bg-primary-700 text-white hover:bg-primary-800 px-8 py-3 text-lg">
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h2 className="text-3xl font-bold text-center mb-12">Why Choose AgriRental?</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="text-center">
                        <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Tractor className="h-8 w-8 text-primary-600" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Wide Selection</h3>
                        <p className="text-gray-600">Access to various agricultural machinery</p>
                    </div>
                    <div className="text-center">
                        <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Shield className="h-8 w-8 text-primary-600" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Secure Payments</h3>
                        <p className="text-gray-600">Safe and encrypted payment processing</p>
                    </div>
                    <div className="text-center">
                        <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Clock className="h-8 w-8 text-primary-600" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Flexible Rental</h3>
                        <p className="text-gray-600">Rent for days, weeks, or months</p>
                    </div>
                    <div className="text-center">
                        <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <TrendingUp className="h-8 w-8 text-primary-600" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Earn Income</h3>
                        <p className="text-gray-600">List your machines and earn money</p>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gray-100 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                    <p className="text-xl text-gray-600 mb-8">Join thousands of farmers and machinery owners</p>
                    <Link to="/register" className="btn btn-primary px-8 py-3 text-lg">
                        Create Account
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
