import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Smartphone, Copy, CheckCircle, Loader2, IndianRupee, AlertCircle } from 'lucide-react';
import { confirmUpiPayment } from '../services/paymentService';

const UPI_ID = '7205389498@nyes';
const UPI_NAME = 'AgriRental';

const UpiPaymentModal = ({ booking, onSuccess, onClose }) => {
    const [upiRef, setUpiRef] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [step, setStep] = useState('pay'); // 'pay' | 'confirm' | 'success'

    if (!booking) return null;

    const amount = booking.totalAmount;
    const receiptNo = booking.receiptNumber || booking._id;
    const note = `Booking ${receiptNo}`;

    // Standard UPI deep link
    const upiLink = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${amount}&tn=${encodeURIComponent(note)}&cu=INR`;

    const copyUpiId = () => {
        navigator.clipboard.writeText(UPI_ID);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!upiRef.trim()) {
            setError('Please enter your UPI Transaction Reference Number');
            return;
        }
        setError('');
        setLoading(true);
        try {
            await confirmUpiPayment(booking._id, upiRef.trim());
            setStep('success');
            setTimeout(() => {
                onSuccess?.();
            }, 2500);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit payment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <IndianRupee className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <div className="text-white font-bold text-lg">Pay via UPI</div>
                            <div className="text-green-100 text-xs">AgriRental Secure Payment</div>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-white/70 hover:text-white transition-colors p-1 rounded-lg">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6">
                    {step === 'success' ? (
                        /* Success Screen */
                        <div className="text-center py-6">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="h-10 w-10 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Submitted!</h3>
                            <p className="text-gray-500 text-sm">
                                Your payment reference has been submitted. The machine owner will confirm your booking shortly.
                            </p>
                            <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700">
                                📩 Check your <strong>My Bookings</strong> tab for live status updates
                            </div>
                        </div>
                    ) : step === 'pay' ? (
                        /* QR Code Payment Screen */
                        <>
                            {/* Amount */}
                            <div className="bg-gray-50 rounded-2xl p-4 text-center mb-5">
                                <p className="text-gray-500 text-sm mb-1">Total Amount to Pay</p>
                                <p className="text-4xl font-extrabold text-gray-900 flex items-center justify-center gap-1">
                                    <IndianRupee className="h-8 w-8" />
                                    {amount.toLocaleString('en-IN')}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">Receipt #{receiptNo?.slice(-8)}</p>
                            </div>

                            {/* QR Code */}
                            <div className="flex justify-center mb-5">
                                <div className="bg-white border-2 border-green-200 rounded-2xl p-4 shadow-inner">
                                    <QRCodeSVG
                                        value={upiLink}
                                        size={180}
                                        fgColor="#15803d"
                                        level="H"
                                        imageSettings={{
                                            src: '',
                                            x: undefined,
                                            y: undefined,
                                            height: 0,
                                            width: 0,
                                            excavate: true,
                                        }}
                                    />
                                </div>
                            </div>

                            {/* UPI ID Copy */}
                            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-4">
                                <span className="text-gray-500 text-sm flex-1 font-mono">{UPI_ID}</span>
                                <button
                                    onClick={copyUpiId}
                                    className="flex items-center gap-1 text-green-600 hover:text-green-700 text-sm font-medium transition-colors"
                                >
                                    {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                            </div>

                            {/* Open in UPI App */}
                            <a
                                href={upiLink}
                                className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-semibold py-3 rounded-xl hover:bg-green-700 transition-colors mb-4"
                            >
                                <Smartphone className="h-5 w-5" />
                                Open in UPI App (GPay / PhonePe / Paytm)
                            </a>

                            <button
                                onClick={() => setStep('confirm')}
                                className="w-full text-center text-green-600 hover:text-green-700 text-sm font-medium py-2 underline underline-offset-2"
                            >
                                Already paid? Click here to confirm →
                            </button>
                        </>
                    ) : (
                        /* Confirm Reference Screen */
                        <>
                            <div className="flex items-center gap-2 mb-5">
                                <button onClick={() => setStep('pay')} className="text-gray-400 hover:text-gray-600">
                                    ← Back
                                </button>
                                <h3 className="text-lg font-semibold text-gray-900">Confirm Your Payment</h3>
                            </div>

                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 flex gap-2">
                                <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                                <p className="text-amber-700 text-sm">
                                    Enter the <strong>UPI Transaction ID / Reference Number</strong> from your payment app so the owner can verify your payment.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        UPI Transaction Reference Number *
                                    </label>
                                    <input
                                        type="text"
                                        value={upiRef}
                                        onChange={(e) => setUpiRef(e.target.value)}
                                        placeholder="e.g. 123456789012 or TXN123456ABC"
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent font-mono"
                                        required
                                    />
                                </div>

                                {error && (
                                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4 shrink-0" />
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading || !upiRef.trim()}
                                    className="w-full bg-green-600 text-white font-semibold py-3 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <><Loader2 className="h-5 w-5 animate-spin" /> Submitting...</>
                                    ) : (
                                        <><CheckCircle className="h-5 w-5" /> Confirm Payment</>
                                    )}
                                </button>
                            </form>
                        </>
                    )}
                </div>

                {step !== 'success' && (
                    <div className="px-6 pb-5 text-center">
                        <p className="text-xs text-gray-400">
                            🔒 Secure payment · UPI ID: <span className="font-mono">{UPI_ID}</span>
                        </p>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: scale(0.95) translateY(10px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .animate-fade-in { animation: fade-in 0.25s ease-out; }
            `}</style>
        </div>
    );
};

export default UpiPaymentModal;
