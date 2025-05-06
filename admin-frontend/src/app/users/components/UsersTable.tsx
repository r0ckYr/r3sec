import React from "react";
import { formatDistanceToNow } from "date-fns";
import { AdminUser } from "@/types/adminTypes";

interface UsersTableProps {
    users: AdminUser[];
    selectedUser: AdminUser | null;
    onUserSelect: (user: AdminUser) => void;
    onEdit: (user: AdminUser) => void;
    onDelete: (user: AdminUser) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({
    users,
    selectedUser,
    onUserSelect,
    onEdit,
    onDelete
}) => {
    if (!users || users.length === 0) {
        return (
            <div className="p-8 text-center">
                <p className="text-zinc-400">No users found</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-zinc-300">
                <thead className="text-xs uppercase bg-zinc-800 text-zinc-400">
                    <tr>
                        <th className="px-6 py-3">Email</th>
                        <th className="px-6 py-3">Role</th>
                        <th className="px-6 py-3">Created</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => {
                        const isSelected = selectedUser && selectedUser.id === user.id;

                        return (
                            <tr
                                key={user.id}
                                className={`border-b border-zinc-800 hover:bg-zinc-800/50 cursor-pointer ${isSelected ? "bg-blue-900/20" : ""
                                    }`}
                                onClick={() => onUserSelect(user)}
                            >
                                <td className="px-6 py-4 font-medium">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs ${user.role === "admin"
                                        ? "bg-red-900/30 text-red-400 border border-red-800"
                                        : "bg-blue-900/30 text-blue-400 border border-blue-800"
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(user);
                                        }}
                                        className="text-red-500 hover:text-red-400"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default UsersTable;
