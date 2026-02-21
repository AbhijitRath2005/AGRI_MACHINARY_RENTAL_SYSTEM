import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';
import Chatbot from './components/Chatbot';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MachineListing from './pages/MachineListing';
import MachineDetail from './pages/MachineDetail';
import UserDashboard from './pages/UserDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AddMachine from './pages/AddMachine';
import ManageMachines from './pages/ManageMachines';
import ManageUsers from './pages/ManageUsers';
import ManageAllMachines from './pages/ManageAllMachines';
import MaintenanceApproval from './pages/MaintenanceApproval';

// Portal Pages
import AdminLogin from './pages/AdminLogin';
import FarmerPortal from './pages/FarmerPortal';
import MachineryOwnerPortal from './pages/MachineryOwnerPortal';

function App() {
    const { loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <Router>
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-grow">
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/machines" element={<MachineListing />} />
                        <Route path="/machines/:id" element={<MachineDetail />} />

                        {/* Portal Routes */}
                        <Route path="/admin-login" element={<AdminLogin />} />
                        <Route path="/farmer-portal" element={<FarmerPortal />} />
                        <Route path="/owner-portal" element={<MachineryOwnerPortal />} />

                        {/* Farmer Routes */}
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute allowedRoles={['farmer']}>
                                    <UserDashboard />
                                </ProtectedRoute>
                            }
                        />

                        {/* Owner Routes */}
                        <Route
                            path="/owner/dashboard"
                            element={
                                <ProtectedRoute allowedRoles={['owner']}>
                                    <OwnerDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/owner/add-machine"
                            element={
                                <ProtectedRoute allowedRoles={['owner']}>
                                    <AddMachine />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/owner/machines"
                            element={
                                <ProtectedRoute allowedRoles={['owner']}>
                                    <ManageMachines />
                                </ProtectedRoute>
                            }
                        />

                        {/* Admin Routes */}
                        <Route
                            path="/admin/dashboard"
                            element={
                                <ProtectedRoute allowedRoles={['admin']}>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/users"
                            element={
                                <ProtectedRoute allowedRoles={['admin']}>
                                    <ManageUsers />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/machines"
                            element={
                                <ProtectedRoute allowedRoles={['admin']}>
                                    <ManageAllMachines />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/maintenance"
                            element={
                                <ProtectedRoute allowedRoles={['admin']}>
                                    <MaintenanceApproval />
                                </ProtectedRoute>
                            }
                        />

                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
                <Footer />
                {/* Global AI Chatbot */}
                <Chatbot />
                <Toaster position="top-right" />
            </div>
        </Router>
    );
}

export default App;
