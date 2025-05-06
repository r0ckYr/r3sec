import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const LoadingSpinner = () => (
    <div className="flex justify-center py-12">
        <div className="h-8 w-8 rounded-full border-4 border-zinc-700 border-t-blue-400 animate-spin"></div>
    </div>
);

export const ErrorDisplay = ({ message, onRetry }: { message: string, onRetry?: () => void }) => (
    <div className="flex-1 bg-black p-6 flex flex-col items-center justify-center">
        <AlertTriangle size={40} className="text-amber-500 mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Something went wrong</h2>
        <p className="text-zinc-400">{message}</p>
        {onRetry && (
            <button
                onClick={onRetry}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
            >
                Retry
            </button>
        )}
    </div>
);

// Common helper functions that can be used across components
export const formatDate = (dateString: string) => {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    } catch (e) {
        return "Invalid date";
    }
};

export const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'completed':
            return "bg-blue-900/30 text-blue-400";
        case 'in_progress':
            return "bg-amber-900/30 text-amber-400";
        case 'pending':
            return "bg-zinc-900/30 text-zinc-400";
        case 'failed':
            return "bg-red-900/30 text-red-400";
        default:
            return "bg-zinc-900/30 text-zinc-400";
    }
};

export const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
        case 'critical':
            return "bg-red-900/20 border-red-800/30 text-red-400";
        case 'high':
            return "bg-orange-900/20 border-orange-800/30 text-orange-400";
        case 'medium':
            return "bg-amber-900/20 border-amber-800/30 text-amber-400";
        case 'low':
            return "bg-blue-900/20 border-blue-800/30 text-blue-400";
        case 'info':
            return "bg-green-900/20 border-green-800/30 text-green-400";
        default:
            return "bg-zinc-900/20 border-zinc-800/30 text-zinc-400";
    }
};
