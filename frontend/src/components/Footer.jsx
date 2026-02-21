import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">AgriRental</h3>
                        <p className="text-gray-400 text-sm">
                            Connecting farmers with agricultural machinery for efficient farming operations.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="/machines" className="hover:text-white transition">Browse Machines</a></li>
                            <li><a href="/register" className="hover:text-white transition">Become an Owner</a></li>
                            <li><a href="/login" className="hover:text-white transition">Login</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li className="flex items-center space-x-2">
                                <Mail className="h-4 w-4" />
                                <span>support@agrirental.com</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <Phone className="h-4 w-4" />
                                <span>+91 98765 43210</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4" />
                                <span>Mumbai, Maharashtra</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
                    <p>&copy; 2024 AgriRental. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
