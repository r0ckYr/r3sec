import React from "react";
import { motion } from "framer-motion";
import { AdminUser } from "@/types/adminTypes";

interface DeleteUserModalProps {
    user: AdminUser | null;
    isProcessing: boolean;
    onClose: () => void;
    onDelete: () => void;
}

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
    user,
    isProcessing,
    onClose,
    onDelete
}) => {
    if (!user) return null;

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget && !isProcessing) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
            onClick={handleBackdropClick}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", duration: 0.3 }}
                className="bg-zinc-900 border border-zinc-700 rounded-lg w-full max-w-md p-6 shadow-xl"
            >
                <div className="text-center mb-6">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                        <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-white">Delete User</h2>
                    <p className="text-zinc-400 mt-2">
                        Are you sure you want to delete <span className="text-white font-medium">{user.email}</span>? This action cannot be undone.
                    </p>
                </div>

                {user.role === "admin" && (
                    <div className="mb-6 p-3 bg-amber-900/30 border border-amber-800 rounded text-amber-400 text-sm">
                        ⚠️ You are about to delete an admin user. Make sure there will still be at least one admin user remaining.
                    </div>
                )}

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded"
                        disabled={isProcessing}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onDelete}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded flex items-center"
                        disabled={isProcessing}
                    >
                        {isProcessing ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </>
                        ) : (
                            "Delete User"
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default DeleteUserModal;
