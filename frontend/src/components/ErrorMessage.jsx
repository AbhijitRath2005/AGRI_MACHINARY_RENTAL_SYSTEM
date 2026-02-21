import { AlertCircle } from 'lucide-react';

const ErrorMessage = ({ message }) => {
    if (!message) return null;

    return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{message}</p>
        </div>
    );
};

export default ErrorMessage;
