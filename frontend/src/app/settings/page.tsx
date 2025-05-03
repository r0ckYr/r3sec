"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import { Shield, Mail, Lock, Bell, Trash2 } from "lucide-react";

// Types
interface User {
    id: string;
    email: string;
    is_verified: boolean;
    is_deleted: boolean;
    email_notifications_enabled: boolean;
    created_at: string;
    updated_at: string;
}

export default function Settings() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);

    // Form states
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // API configuration
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);


    // Get auth headers for API calls
    const getAuthHeaders = () => {
        const authToken = localStorage.getItem("authToken");
        return {
            "Authorization": `Bearer ${authToken}`,
            "Content-Type": "application/json"
        };
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${backendUrl}/api/user/me`, {
                method: "GET",
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                if (response.status === 401) {
                    router.push("/");
                    return;
                }
                throw new Error("Failed to fetch user data");
            }

            const userData = await response.json();
            setUser(userData);
            setEmail(userData.email);
            setNotificationsEnabled(userData.email_notifications_enabled);
        } catch (error) {
            toast.error("Failed to load user data");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const updateEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            setUpdating(true);
            const response = await fetch(`${backendUrl}/api/user/${user.id}`, {
                method: "PATCH",
                headers: getAuthHeaders(),
                body: JSON.stringify({ email })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to update email");
            }

            toast.success("Email updated! Please verify your email to continue");
            fetchUserData();
        } catch (error: any) {
            toast.error(error.message || "An unknown error occurred");
        } finally {
            setUpdating(false);
        }
    };

    const updatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        if (newPassword.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            setChangingPassword(true);
            const response = await fetch(`${backendUrl}/api/user/${user.id}/password`, {
                method: "PATCH",
                headers: getAuthHeaders(),
                body: JSON.stringify({ new_password: newPassword })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to update password");
            }

            toast.success("Password changed successfully");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error: any) {
            toast.error(error.message || "An unknown error occurred");
        } finally {
            setChangingPassword(false);
        }
    };

    const toggleNotifications = async () => {
        if (!user) return;

        try {
            const newState = !notificationsEnabled;
            setNotificationsEnabled(newState); // Optimistic update

            const response = await fetch(`${backendUrl}/api/user/notifications`, {
                method: "PATCH",
                headers: getAuthHeaders(),
                body: JSON.stringify({ enabled: newState })
            });

            if (!response.ok) {
                setNotificationsEnabled(!newState); // Revert on error
                const data = await response.json();
                throw new Error(data.error || "Failed to update notification settings");
            }

            toast.success(`Email notifications ${newState ? "enabled" : "disabled"}`);
        } catch (error: any) {
            toast.error(error.message || "An unknown error occurred");
        }
    };

    const deleteAccount = async () => {
        if (!user) return;

        try {
            const response = await fetch(`${backendUrl}/api/user/${user.id}`, {
                method: "DELETE",
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to delete account");
            }

            toast.success("Account deleted successfully");
            localStorage.removeItem("authToken");
            router.push("/");
        } catch (error: any) {
            toast.error(error.message || "An unknown error occurred");
        } finally {
            setShowDeleteConfirm(false);
        }
    };

    // Loading component
    const LoadingSpinner = () => (
        <div className="flex-1 bg-black p-6 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full border-4 border-zinc-700 border-t-green-400 animate-spin"></div>
        </div>
    );

    // Form button with loading state
    const ActionButton = ({
        isLoading,
        disabled,
        loadingText,
        text,
        type = "submit",
        onClick,
        className = "bg-green-600 hover:bg-green-500"
    }: {
        isLoading: boolean;
        disabled: boolean;
        loadingText: string;
        text: string;
        type?: "button" | "submit";
        onClick?: () => void;
        className?: string;
    }) => (
        <button
            type={type}
            onClick={onClick}
            disabled={isLoading || disabled}
            className={`px-4 py-2 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
        >
            {isLoading ? (
                <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                    <span>{loadingText}</span>
                </div>
            ) : (
                text
            )}
        </button>
    );

    // Main content renderer
    const renderContent = () => {
        if (!user) return null;

        return (
            <div className="flex-1 bg-black p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-white">Settings</h1>
                    <div className="flex items-center space-x-2">
                        <Shield size={20} className={user.is_verified ? "text-green-400" : "text-amber-500"} />
                        <span className={`text-sm ${user.is_verified ? "text-green-400" : "text-amber-500"}`}>
                            {user.is_verified ? "Verified Account" : "Unverified Account"}
                        </span>
                    </div>
                </div>

                {/* Email Settings */}
                <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900 space-y-4">
                    <div className="flex items-center space-x-3">
                        <Mail size={20} className="text-green-400" />
                        <h2 className="text-xl font-semibold text-white">Email Settings</h2>
                    </div>

                    <form onSubmit={updateEmail} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-zinc-400">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <ActionButton
                                isLoading={updating}
                                disabled={email === user.email}
                                loadingText="Updating..."
                                text="Update Email"
                            />

                            {!user.is_verified && (
                                <span className="text-amber-500 text-sm">
                                    Please verify your email address
                                </span>
                            )}
                        </div>
                    </form>
                </div>

                {/* Password Settings */}
                <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900 space-y-4">
                    <div className="flex items-center space-x-3">
                        <Lock size={20} className="text-green-400" />
                        <h2 className="text-xl font-semibold text-white">Password Settings</h2>
                    </div>

                    <form onSubmit={updatePassword} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="new-password" className="block text-sm font-medium text-zinc-400">
                                New Password
                            </label>
                            <input
                                type="password"
                                id="new-password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                required
                                minLength={8}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="confirm-password" className="block text-sm font-medium text-zinc-400">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirm-password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                required
                                minLength={8}
                            />
                        </div>

                        <ActionButton
                            isLoading={changingPassword}
                            disabled={!newPassword || !confirmPassword}
                            loadingText="Changing Password..."
                            text="Change Password"
                        />
                    </form>
                </div>

                {/* Notification Settings */}
                <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900 space-y-4">
                    <div className="flex items-center space-x-3">
                        <Bell size={20} className="text-green-400" />
                        <h2 className="text-xl font-semibold text-white">Notification Settings</h2>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-zinc-300">Email Notifications</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={notificationsEnabled}
                                onChange={toggleNotifications}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-500 rounded-full peer peer-checked:bg-green-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                        </label>
                    </div>
                    <p className="text-sm text-zinc-500">
                        Receive email notifications about security alerts, updates, and account activity.
                    </p>
                </div>

                {/* Danger Zone */}
                <div className="p-6 rounded-xl border border-red-900/20 bg-red-950/10 space-y-4">
                    <div className="flex items-center space-x-3">
                        <Trash2 size={20} className="text-red-500" />
                        <h2 className="text-xl font-semibold text-white">Danger Zone</h2>
                    </div>

                    <p className="text-sm text-zinc-400">
                        Once you delete your account, there is no going back. Please be certain.
                    </p>

                    {showDeleteConfirm ? (
                        <div className="space-y-4">
                            <p className="text-red-400 font-medium">Are you sure you want to delete your account?</p>
                            <div className="flex space-x-3">
                                <ActionButton
                                    isLoading={false}
                                    disabled={false}
                                    loadingText=""
                                    text="Yes, Delete Account"
                                    type="button"
                                    onClick={deleteAccount}
                                    className="bg-red-600 hover:bg-red-500"
                                />
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="px-4 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="px-4 py-2 bg-zinc-800 text-red-400 border border-red-900/30 rounded-lg hover:bg-red-900/20 transition-colors"
                        >
                            Delete Account
                        </button>
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
                            primary: '#10b981',
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

            {/* Layout with dynamic sidebar */}
            <Sidebar onToggle={setSidebarCollapsed} />
            <div
                className={`min-h-screen transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'
                    }`}
            >
                {loading ? <LoadingSpinner /> : renderContent()}
            </div>
        </>
    );
}
