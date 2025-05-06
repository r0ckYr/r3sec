// components/admin/modals/StatusUpdateModal.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { X, RefreshCw, CheckCircle, Clock, CircleDashed, AlertCircle } from 'lucide-react';
import { Contract } from '@/types/adminTypes';

interface StatusUpdateModalProps {
    selectedContract: Contract | null;
    newStatus: string;
    setNewStatus: (status: string) => void;
    isUpdatingStatus: boolean;
    onClose: () => void;
    onUpdate: () => void;
}

const StatusUpdateModal: React.FC<StatusUpdateModalProps> = ({
    selectedContract,
    newStatus,
    setNewStatus,
    isUpdatingStatus,
    onClose,
    onUpdate
}) => {
    if (!selectedContract) return null;

    // Get status color
    const getStatusColor = (status: string) => {
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

    // Get status icon
    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return <CheckCircle size={16} className="text-blue-400" />;
            case 'in_progress':
                return <Clock size={16} className="text-amber-400" />;
            case 'pending':
                return <CircleDashed size={16} className="text-zinc-400" />;
            case 'failed':
                return <AlertCircle size={16} className="text-red-400" />;
            default:
                return <CircleDashed size={16} className="text-zinc-400" />;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-md w-full"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Update Contract Status</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
                    >
                        <X size={20} className="text-zinc-400" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-zinc-400 text-sm font-medium mb-2">
                            Current Status
                        </label>
                        <div className={`inline-flex items-center px-3 py-1 rounded-full ${getStatusColor(selectedContract.status)}`}>
                            {getStatusIcon(selectedContract.status)}
                            <span className="ml-2 capitalize">{selectedContract.status}</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-zinc-400 text-sm font-medium mb-2">
                            New Status
                        </label>
                        <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Select status</option>
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="failed">Failed</option>
                        </select>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            onClick={onUpdate}
                            disabled={isUpdatingStatus || !newStatus}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:bg-zinc-600 disabled:text-zinc-400 transition-colors flex items-center space-x-2"
                        >
                            {isUpdatingStatus ? (
                                <>
                                    <div className="h-4 w-4 rounded-full border-2 border-zinc-500 border-t-white animate-spin"></div>
                                    <span>Updating...</span>
                                </>
                            ) : (
                                <>
                                    <RefreshCw size={18} />
                                    <span>Update Status</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default StatusUpdateModal;
