import React from 'react';
import { CheckCircle, AlertCircle, XCircle, X } from 'lucide-react';

const Toast = ({ message, type, onClose }) => {
    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'error':
                return <XCircle className="h-5 w-5 text-red-500" />;
            default:
                return <AlertCircle className="h-5 w-5 text-blue-500" />;
        }
    };

    return (
        <div className="animate-slide-in-right">
            <div className={`max-w-md w-full rounded-lg shadow-lg overflow-hidden
                ${type === 'success' ? 'bg-green-50 border-l-4 border-green-500' :
                type === 'error' ? 'bg-red-50 border-l-4 border-red-500' :
                'bg-blue-50 border-l-4 border-blue-500'}`}
            >
                <div className="p-4">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            {getIcon()}
                        </div>
                        <div className="ml-3 flex-1">
                            <p className={`text-sm font-medium
                                ${type === 'success' ? 'text-green-800' :
                                type === 'error' ? 'text-red-800' :
                                'text-blue-800'}`}
                            >
                                {message}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className={`flex-shrink-0 ml-4 p-1.5 rounded-full focus:outline-none
                                ${type === 'success' ? 'hover:bg-green-100 text-green-500' :
                                type === 'error' ? 'hover:bg-red-100 text-red-500' :
                                'hover:bg-blue-100 text-blue-500'}`}
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Toast;