import React from "react";
import { motion } from "framer-motion";

interface UserFormModalProps {
    title: string;
    formData: {
        email: string;
        password: string;
        role: string;
    };
    setFormData: React.Dispatch<React.SetStateAction<{
        email: string;
        password: string;
        role: string;
    }>>;
    isProcessing: boolean;
    onClose: () => void;
    onSubmit: () => void;
    submitText: string;
    isEditMode?: boolean;
}

const UserFormModal: React.FC<UserFormModalProps> = ({
    title,
    formData,
    setFormData,
    isProcessing,
    onClose,
    onSubmit,
    submitText,
    isEditMode = false
}) => {
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
                <h2 className="text-xl font-bold text-white mb-4">{title}</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-zinc-400 text-sm mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="user@example.com"
                            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isProcessing}
                        />
                    </div>

                    <div>
                        <label className="block text-zinc-400 text-sm mb-1">
                            {isEditMode ? "New Password (leave blank to keep current)" : "Password"}
                        </label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder={isEditMode ? "••••••••" : "Minimum 8 characters"}
                            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isProcessing}
                            required={!isEditMode}
                        />
                        {isEditMode && (
                            <p className="text-zinc-500 text-xs mt-1">
                                Leave blank to keep the current password
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-zinc-400 text-sm mb-1">
                            Role
                        </label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isProcessing}
                        >
                            <option value="auditor">Auditor</option>
                            <option value="admin">Admin</option>
                        </select>
                        <p className="text-zinc-500 text-xs mt-1">
                            {formData.role === "admin"
                                ? "Admin has full access to all features including user management"
                                : "Auditor can manage contracts but cannot modify users"}
                        </p>
                    </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded"
                        disabled={isProcessing}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSubmit}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center"
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
                            submitText
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default UserFormModal;
