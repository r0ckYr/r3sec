import React from "react";
import { format } from "date-fns";
import { AdminUser } from "@/types/adminTypes";

interface UserDetailsProps {
    user: AdminUser | null;
    onEdit: () => void;
    onDelete: () => void;
    onBack: () => void;
}

const UserDetails: React.FC<UserDetailsProps> = ({
    user,
    onEdit,
    onDelete,
    onBack
}) => {
    if (!user) {
        return (
            <div className="text-center py-8">
                <p className="text-zinc-400">No user selected</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="text-zinc-400 hover:text-white flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back to users
                </button>

                <div className="flex space-x-2">
                    <button
                        onClick={onEdit}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                    >
                        Edit User
                    </button>
                    <button
                        onClick={onDelete}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                    >
                        Delete User
                    </button>
                </div>
            </div>

            <div className="bg-zinc-800/50 rounded-lg p-6 border border-zinc-700">
                <h2 className="text-xl font-bold text-white mb-4">User Details</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-zinc-400 text-sm mb-1">Email</h3>
                        <p className="text-white font-medium">{user.email}</p>
                    </div>

                    <div>
                        <h3 className="text-zinc-400 text-sm mb-1">Role</h3>
                        <span className={`px-2 py-1 rounded text-xs ${user.role === "admin"
                            ? "bg-red-900/30 text-red-400 border border-red-800"
                            : "bg-blue-900/30 text-blue-400 border border-blue-800"
                            }`}>
                            {user.role}
                        </span>
                    </div>

                    <div>
                        <h3 className="text-zinc-400 text-sm mb-1">User ID</h3>
                        <p className="text-zinc-300 font-mono text-sm">{user.id}</p>
                    </div>

                    <div>
                        <h3 className="text-zinc-400 text-sm mb-1">Created</h3>
                        <p className="text-zinc-300">
                            {format(new Date(user.created_at), "PPP 'at' p")}
                        </p>
                    </div>

                    {user.updated_at && (
                        <div>
                            <h3 className="text-zinc-400 text-sm mb-1">Last Updated</h3>
                            <p className="text-zinc-300">
                                {format(new Date(user.updated_at), "PPP 'at' p")}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-zinc-800/50 rounded-lg p-6 border border-zinc-700">
                <h2 className="text-xl font-bold text-white mb-4">Role Permissions</h2>

                <div className="space-y-4">
                    {user.role === "admin" ? (
                        <>
                            <div className="bg-zinc-700/50 p-4 rounded border border-zinc-600">
                                <h3 className="text-white font-medium mb-2">Admin Permissions</h3>
                                <ul className="list-disc list-inside text-zinc-300 space-y-1">
                                    <li>Create, edit, and delete admin users</li>
                                    <li>Manage user contracts and submissions</li>
                                    <li>Update contract status and workflow</li>
                                    <li>Submit audit reports and findings</li>
                                    <li>Access all platform features</li>
                                </ul>
                            </div>
                            <p className="text-amber-400 text-sm">
                                ⚠️ Admin users have full access to the platform. Be careful when assigning this role.
                            </p>
                        </>
                    ) : (
                        <>
                            <div className="bg-zinc-700/50 p-4 rounded border border-zinc-600">
                                <h3 className="text-white font-medium mb-2">Auditor Permissions</h3>
                                <ul className="list-disc list-inside text-zinc-300 space-y-1">
                                    <li>View user contracts and submissions</li>
                                    <li>Update contract status</li>
                                    <li>Submit audit reports and findings</li>
                                    <li>Cannot manage other admin users</li>
                                </ul>
                            </div>
                            <p className="text-blue-400 text-sm">
                                ℹ️ Auditor users have limited permissions and cannot manage other admin users.
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDetails;
