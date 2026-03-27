import { useState, useRef } from 'react';
import { X, Printer, Download, IndianRupee, CheckCircle, Clock, Building2 } from 'lucide-react';
import { getReceipt } from '../services/paymentService';

const ReceiptModal = ({ bookingId, onClose }) => {
    const [receipt, setReceipt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const printRef = useRef();

    // Fetch receipt on first render
    useState(() => {
        const fetch = async () => {
            try {
                const res = await getReceipt(bookingId);
                setReceipt(res.data.data);
            } catch (err) {
                setError('Could not load receipt. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        if (bookingId) fetch();
    }, [bookingId]);

    const handlePrint = () => {
        const content = printRef.current.innerHTML;
        const win = window.open('', '_blank');
        win.document.write(`
            <html><head><title>AgriRental Receipt</title>
            <style>
                body { font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; color: #111; }
                .header { text-align: center; border-bottom: 2px solid #16a34a; padding-bottom: 16px; margin-bottom: 16px; }
                .logo { font-size: 24px; font-weight: bold; color: #16a34a; }
                .badge { background: #dcfce7; color: #15803d; border-radius: 20px; padding: 4px 12px; font-size: 12px; font-weight: 600; }
                .section { margin-bottom: 16px; }
                .row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
                .total { font-size: 18px; font-weight: bold; color: #16a34a; }
                .footer { text-align: center; font-size: 12px; color: #888; margin-top: 24px; border-top: 1px solid #eee; padding-top: 12px; }
            </style>
            </head><body>${content}</body></html>
        `);
        win.document.close();
        win.print();
    };

    const fmt = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <Building2 className="h-6 w-6 text-white" />
                        <div>
                            <div className="text-white font-bold">Booking Receipt</div>
                            <div className="text-green-100 text-xs">AgriRental · Official Document</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {receipt && (
                            <>
                                <button onClick={handlePrint} className="flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white text-sm px-3 py-1.5 rounded-lg transition-colors">
                                    <Printer className="h-4 w-4" /> Print
                                </button>
                            </>
                        )}
                        <button onClick={onClose} className="text-white/70 hover:text-white p-1 rounded-lg">
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="overflow-y-auto flex-1 p-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-3">
                            <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
                            <p className="text-gray-400 text-sm">Loading receipt...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-center">
                            {error}
                        </div>
                    ) : receipt ? (
                        <div ref={printRef}>
                            {/* Receipt Header */}
                            <div className="header text-center border-b-2 border-green-500 pb-4 mb-5">
                                <div className="logo text-2xl font-extrabold text-green-600 mb-1">🌾 AgriRental</div>
                                <div className="text-gray-500 text-sm">Agricultural Machinery Rental Platform</div>
                                <div className="mt-3 flex items-center justify-center gap-2">
                                    <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                                        {receipt.payment?.status === 'completed' ? '✅ PAID' : receipt.booking?.paymentStatus === 'pending_verification' ? '⏳ PENDING VERIFICATION' : '⚠️ UNPAID'}
                                    </span>
                                </div>
                            </div>

                            {/* Receipt & Booking IDs */}
                            <div className="bg-gray-50 rounded-2xl p-4 mb-5 text-sm">
                                <div className="flex justify-between py-1">
                                    <span className="text-gray-500">Receipt Number</span>
                                    <span className="font-bold font-mono text-green-700">{receipt.receiptNumber}</span>
                                </div>
                                <div className="flex justify-between py-1">
                                    <span className="text-gray-500">Booking ID</span>
                                    <span className="font-mono text-gray-700 text-xs">{receipt.booking?._id}</span>
                                </div>
                                <div className="flex justify-between py-1">
                                    <span className="text-gray-500">Date Generated</span>
                                    <span className="text-gray-700">{fmt(receipt.generatedAt)}</span>
                                </div>
                            </div>

                            {/* Parties */}
                            <div className="grid grid-cols-2 gap-3 mb-5">
                                <div className="bg-blue-50 rounded-2xl p-4">
                                    <p className="text-xs font-semibold text-blue-400 uppercase tracking-wide mb-2">Farmer (Renter)</p>
                                    <p className="font-bold text-gray-900">{receipt.booking?.userId?.name || '—'}</p>
                                    <p className="text-sm text-gray-500">{receipt.booking?.userId?.email}</p>
                                    <p className="text-sm text-gray-500">{receipt.booking?.userId?.phone}</p>
                                </div>
                                <div className="bg-amber-50 rounded-2xl p-4">
                                    <p className="text-xs font-semibold text-amber-500 uppercase tracking-wide mb-2">Machine Owner</p>
                                    <p className="font-bold text-gray-900">{receipt.booking?.machineId?.ownerId?.name || '—'}</p>
                                    <p className="text-sm text-gray-500">{receipt.booking?.machineId?.ownerId?.email}</p>
                                    <p className="text-sm text-gray-500">{receipt.booking?.machineId?.ownerId?.phone}</p>
                                </div>
                            </div>

                            {/* Machine Details */}
                            <div className="border border-gray-200 rounded-2xl overflow-hidden mb-5">
                                <div className="bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Machine Details</div>
                                <div className="px-4 py-3 space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Machine Name</span>
                                        <span className="font-semibold">{receipt.booking?.machineId?.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Type</span>
                                        <span>{receipt.booking?.machineId?.type}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Location</span>
                                        <span>{receipt.booking?.machineId?.location || '—'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Rental Period & Charges */}
                            <div className="border border-gray-200 rounded-2xl overflow-hidden mb-5">
                                <div className="bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Rental Period & Charges</div>
                                <div className="px-4 py-3 space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">From</span>
                                        <span className="font-medium">{fmt(receipt.booking?.startDate)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">To</span>
                                        <span className="font-medium">{fmt(receipt.booking?.endDate)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Total Days</span>
                                        <span className="font-medium">{receipt.booking?.totalDays} days</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Rate per Day</span>
                                        <span>₹{receipt.booking?.machineId?.pricePerDay?.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-2 flex justify-between items-center">
                                        <span className="font-bold text-gray-800">Total Amount</span>
                                        <span className="text-xl font-extrabold text-green-600 flex items-center gap-0.5">
                                            <IndianRupee className="h-5 w-5" />
                                            {receipt.booking?.totalAmount?.toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Details */}
                            <div className="border border-gray-200 rounded-2xl overflow-hidden mb-4">
                                <div className="bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Payment Details</div>
                                <div className="px-4 py-3 space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Payment Method</span>
                                        <span className="font-medium">UPI</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">UPI ID</span>
                                        <span className="font-mono text-gray-700">7205389498@nyes</span>
                                    </div>
                                    {receipt.payment?.upiRef && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Transaction Ref</span>
                                            <span className="font-mono text-green-700">{receipt.payment.upiRef}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Payment Status</span>
                                        <span className={`font-semibold ${receipt.payment?.status === 'completed' ? 'text-green-600' : 'text-amber-500'}`}>
                                            {receipt.payment?.status === 'completed' ? '✅ Completed' :
                                                receipt.booking?.paymentStatus === 'pending_verification' ? '⏳ Pending Verification' : '⚠️ Unpaid'}
                                        </span>
                                    </div>
                                    {receipt.payment?.paymentDate && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Payment Date</span>
                                            <span>{fmt(receipt.payment.paymentDate)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="footer text-center text-xs text-gray-400 border-t border-gray-100 pt-4 mt-4">
                                Thank you for using AgriRental 🌾 · This is a digitally generated receipt.
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default ReceiptModal;
