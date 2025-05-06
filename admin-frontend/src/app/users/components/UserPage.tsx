"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

import AdminSidebar from "../../components/Sidebar";
import { LoadingSpinner, ErrorDisplay } from "../../components/UIComponents";

import { AdminUser, Pagination } from "@/types/adminTypes";

import UsersTable from "../components/UsersTable";
import UserDetails from "../components/UserDetails";
import UserFormModal from "../components/UserFormModal";
import DeleteUserModal from "../components/DeleteUserModal";

export default function AdminUsers() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    const [userDetails, setUserDetails] = useState<AdminUser | null>(null);

    const [loading, setLoading] = useState(true);
    const [detailLoading, setDetailLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Modal states
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Form data
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: "auditor"
    });

    // Filtering and sorting
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [sortBy, setSortBy] = useState("created_at");
    const [sortOrder, setSortOrder] = useState("desc");

    // Pagination
    const [pagination, setPagination] = useState<Pagination>({
        limit: 20,
        page: 1,
        pages: 1,
        total: 0
    });

    // Dashboard state
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // API configuration
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

    // Get auth headers for API calls
    const getAuthHeaders = () => {
        const authToken = localStorage.getItem("adminAuthToken");
        return {
            "Authorization": `Bearer ${authToken}`,
            "Content-Type": "application/json"
        };
    };

    useEffect(() => {
        // Check for authentication
        const authToken = localStorage.getItem("adminAuthToken");
        if (!authToken) {
            router.push("/");
            return;
        }

        fetchUsers();
    }, [pagination.page, roleFilter, sortBy, sortOrder, searchTerm]);

    // Check for user ID in URL and open it
    useEffect(() => {
        const userIdFromUrl = searchParams.get('id');
        if (userIdFromUrl && users.length > 0) {
            const userFromUrl = users.find(user => user.id === userIdFromUrl);
            if (userFromUrl) {
                setSelectedUser(userFromUrl);
                setUserDetails(userFromUrl);
            }
        }
    }, [searchParams, users]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);

            let url = `${backendUrl}/api/admin/users?page=${pagination.page}&limit=${pagination.limit}`;

            if (roleFilter !== "all") {
                url += `&role=${roleFilter}`;
            }

            if (searchTerm) {
                url += `&search=${encodeURIComponent(searchTerm)}`;
            }

            url += `&sort=${sortBy}&order=${sortOrder}`;

            const response = await fetch(url, {
                method: "GET",
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                if (response.status === 401) {
                    toast.error("Session expired. Please log in again.");
                    router.push("/");
                    return;
                }
                throw new Error(`Failed to fetch users: ${response.status}`);
            }

            const data = await response.json();
            setUsers(data.users || []);
            setPagination(data.pagination || {
                limit: 20,
                page: 1,
                pages: 1,
                total: 0
            });

            // Check for user ID in URL after fetching users
            const userIdFromUrl = searchParams.get('id');
            if (userIdFromUrl) {
                const userFromUrl = data.users.find(user => user.id === userIdFromUrl);
                if (userFromUrl) {
                    setSelectedUser(userFromUrl);
                    setUserDetails(userFromUrl);
                }
            }
        } catch (error: any) {
            console.error("Error fetching users:", error);
            setError(error.message || "Failed to load users");
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    const handleUserSelect = (user: AdminUser) => {
        setSelectedUser(user);
        setUserDetails(user);
        // Update URL with the user ID
        router.push(`/users?id=${user.id}`);
    };

    const clearSelectedUser = () => {
        setSelectedUser(null);
        setUserDetails(null);
        // Update URL to remove the id parameter
        router.push('/users');
    };

    const handleCreateUser = async () => {
        if (!formData.email || !formData.password) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            setIsProcessing(true);

            const response = await fetch(`${backendUrl}/api/admin/users`, {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to create user");
            }

            const data = await response.json();
            toast.success("User created successfully");

            // Refresh users list
            fetchUsers();
            setShowCreateModal(false);

            // Reset form data
            setFormData({
                email: "",
                password: "",
                role: "auditor"
            });

        } catch (error: any) {
            console.error("Error creating user:", error);
            toast.error(error.message || "Failed to create user");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleUpdateUser = async () => {
        if (!selectedUser || !formData.email) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            setIsProcessing(true);

            // Only send fields that are not empty
            const updateData: any = {};
            if (formData.email) updateData.email = formData.email;
            if (formData.password) updateData.password = formData.password;
            if (formData.role) updateData.role = formData.role;

            const response = await fetch(`${backendUrl}/api/admin/users/${selectedUser.id}`, {
                method: "PUT",
                headers: getAuthHeaders(),
                body: JSON.stringify(updateData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to update user");
            }

            const data = await response.json();
            toast.success("User updated successfully");

            // Update local state
            if (data.admin_user) {
                setSelectedUser(data.admin_user);
                setUserDetails(data.admin_user);

                // Update user in the list
                setUsers(users.map(user =>
                    user.id === data.admin_user.id ? data.admin_user : user
                ));
            }

            setShowEditModal(false);

        } catch (error: any) {
            console.error("Error updating user:", error);
            toast.error(error.message || "Failed to update user");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDeleteUser = async () => {
        if (!selectedUser) return;

        try {
            setIsProcessing(true);

            const response = await fetch(`${backendUrl}/api/admin/users/${selectedUser.id}`, {
                method: "DELETE",
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to delete user");
            }

            toast.success("User deleted successfully");

            // Remove from local state
            setUsers(users.filter(user => user.id !== selectedUser.id));
            clearSelectedUser();
            setShowDeleteModal(false);

        } catch (error: any) {
            console.error("Error deleting user:", error);
            toast.error(error.message || "Failed to delete user");
        } finally {
            setIsProcessing(false);
        }
    };

    const openCreateModal = () => {
        setFormData({
            email: "",
            password: "",
            role: "auditor"
        });
        setShowCreateModal(true);
    };

    const openEditModal = () => {
        if (!selectedUser) return;

        setFormData({
            email: selectedUser.email,
            password: "", // Don't pre-fill password
            role: selectedUser.role
        });
        setShowEditModal(true);
    };

    // Main content renderer
    const renderContent = () => {
        return (
            <div className="flex-1 bg-black p-6 space-y-6">
                {/* Header with filters */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">User Management</h1>
                        <p className="text-zinc-400 text-sm">
                            Create and manage admin users
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={openCreateModal}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
                        >
                            Create User
                        </button>

                    </div>
                </div>

                {/* Main content area with list/detail view */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden">
                    {selectedUser ? (
                        <div className="p-6">
                            {detailLoading ? (
                                <LoadingSpinner />
                            ) : (
                                <UserDetails
                                    user={userDetails}
                                    onEdit={openEditModal}
                                    onDelete={() => setShowDeleteModal(true)}
                                    onBack={clearSelectedUser}
                                />
                            )}
                        </div>
                    ) : (
                        <div>
                            {loading ? (
                                <div className="flex justify-center py-12">
                                    <LoadingSpinner />
                                </div>
                            ) : error ? (
                                <ErrorDisplay
                                    message={error}
                                    onRetry={fetchUsers}
                                />
                            ) : (
                                <div>
                                    <UsersTable
                                        users={users}
                                        selectedUser={selectedUser}
                                        onUserSelect={handleUserSelect}
                                        onEdit={(user) => {
                                            setSelectedUser(user);
                                            openEditModal();
                                        }}
                                        onDelete={(user) => {
                                            setSelectedUser(user);
                                            setShowDeleteModal(true);
                                        }}
                                    />
                                    <div className="p-4 border-t border-zinc-800">
                                        {pagination.pages > 1 && (
                                            <div className="flex items-center justify-between mt-4 text-sm">
                                                <p className="text-zinc-400">
                                                    Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} users
                                                </p>

                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => setPagination({ ...pagination, page: Math.max(1, pagination.page - 1) })}
                                                        disabled={pagination.page === 1}
                                                        className="px-3 py-1 rounded bg-zinc-800 text-white disabled:bg-zinc-900 disabled:text-zinc-600"
                                                    >
                                                        Previous
                                                    </button>

                                                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                                                        <button
                                                            key={page}
                                                            onClick={() => setPagination({ ...pagination, page })}
                                                            className={`px-3 py-1 rounded ${pagination.page === page ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}
                                                        >
                                                            {page}
                                                        </button>
                                                    ))}

                                                    <button
                                                        onClick={() => setPagination({ ...pagination, page: Math.min(pagination.pages, pagination.page + 1) })}
                                                        disabled={pagination.page === pagination.pages}
                                                        className="px-3 py-1 rounded bg-zinc-800 text-white disabled:bg-zinc-900 disabled:text-zinc-600"
                                                    >
                                                        Next
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#27272a',
                        color: '#fff',
                        border: '1px solid #3f3f46',
                    },
                    success: {
                        iconTheme: {
                            primary: '#3b82f6',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#fff',
                        },
                    },
                }}
            />

            {/* Modals */}
            <AnimatePresence>
                {showCreateModal && (
                    <UserFormModal
                        title="Create New User"
                        formData={formData}
                        setFormData={setFormData}
                        isProcessing={isProcessing}
                        onClose={() => setShowCreateModal(false)}
                        onSubmit={handleCreateUser}
                        submitText="Create User"
                    />
                )}
                {showEditModal && (
                    <UserFormModal
                        title="Edit User"
                        formData={formData}
                        setFormData={setFormData}
                        isProcessing={isProcessing}
                        onClose={() => setShowEditModal(false)}
                        onSubmit={handleUpdateUser}
                        submitText="Update User"
                        isEditMode={true}
                    />
                )}
                {showDeleteModal && (
                    <DeleteUserModal
                        user={selectedUser}
                        isProcessing={isProcessing}
                        onClose={() => setShowDeleteModal(false)}
                        onDelete={handleDeleteUser}
                    />
                )}
            </AnimatePresence>

            {/* Layout with sidebar */}
            <AdminSidebar onToggle={setIsSidebarOpen} />
            <div
                className={`min-h-screen transition-all duration-300 ${isSidebarOpen ? 'ml-20' : 'ml-64'}`}
            >
                {loading && !selectedUser && !users.length ? (
                    <LoadingSpinner />
                ) : error && !selectedUser && !users.length ? (
                    <ErrorDisplay message={error} onRetry={fetchUsers} />
                ) : (
                    renderContent()
                )}
            </div>
        </>
    );
}
