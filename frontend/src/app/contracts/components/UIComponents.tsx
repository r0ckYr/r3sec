import React from "react";
import { AlertTriangle } from "lucide-react";

// Loading spinner component
export const LoadingSpinner = () => (
    <div className="flex-1 bg-black p-6 flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-zinc-700 border-t-green-400 animate-spin"></div>
    </div>
);

// Error display component
export const ErrorDisplay = ({ message, onRetry }) => (
    <div className="flex-1 bg-black p-6 flex flex-col items-center justify-center">
        <AlertTriangle size={40} className="text-amber-500 mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Something went wrong</h2>
        <p className="text-zinc-400">{message}</p>
        {onRetry && (
            <button
                onClick={onRetry}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors"
            >
                Retry
            </button>
        )}
    </div>
);

