"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import { Shield, Mail, Lock, Bell, Trash2, AlertCircle, CheckCircle } from "lucide-react";

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
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // Form states with sections
    const [emailSection, setEmailSection] = useState({
        email: "",
        updating: false,
        touched: false
    });

    const [passwordSection, setPasswordSection] = useState({
        newPassword: "",
        confirmPassword: "",
        changing: false,
        passwordStrength: 0,
        touched: false
    });

    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deletingAccount, setDeletingAccount] = useState(false);

    // API configuration
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

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
                    toast.error("Session expired. Please login again.");
                    localStorage.removeItem("authToken");
                    router.push("/");
                    return;
                }
                throw new Error("Failed to fetch user data");
            }

            const userData = await response.json();
            setUser(userData);

            // Initialize form states
            setEmailSection({
                ...emailSection,
                email: userData.email
            });

            setNotificationsEnabled(userData.email_notifications_enabled);
        } catch (error) {
            toast.error("Failed to load user data");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Check password strength
    const checkPasswordStrength = (password: string): number => {
        if (!password) return 0;

        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (password.match(/[A-Z]/)) strength += 1;
        if (password.match(/[0-9]/)) strength += 1;
        if (password.match(/[^A-Za-z0-9]/)) strength += 1;

        return strength;
    };

    const updateEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        if (emailSection.email === user.email) {
            toast.error("Please enter a different email address");
            return;
        }

        try {
            setEmailSection({ ...emailSection, updating: true });
            const response = await fetch(`${backendUrl}/api/user/${user.id}`, {
                method: "PATCH",
                headers: getAuthHeaders(),
                body: JSON.stringify({ email: emailSection.email })
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
            setEmailSection({ ...emailSection, updating: false, touched: false });
        }
    };

    const updatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        if (passwordSection.newPassword.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }

        if (passwordSection.newPassword !== passwordSection.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            setPasswordSection({ ...passwordSection, changing: true });
            const response = await fetch(`${backendUrl}/api/user/${user.id}/password`, {
                method: "PATCH",
                headers: getAuthHeaders(),
                body: JSON.stringify({ new_password: passwordSection.newPassword })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to update password");
            }

            toast.success("Password changed successfully");
            setPasswordSection({
                newPassword: "",
                confirmPassword: "",
                changing: false,
                passwordStrength: 0,
                touched: false
            });
        } catch (error: any) {
            toast.error(error.message || "An unknown error occurred");
        } finally {
            setPasswordSection({ ...passwordSection, changing: false });
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
            setDeletingAccount(true);
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
            setDeletingAccount(false);
            setShowDeleteConfirm(false);
        }
    };

    // Components
    const LoadingSpinner = () => (
        <div className="flex-1 bg-black p-6 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full border-4 border-zinc-700 border-t-green-400 animate-spin"></div>
        </div>
    );

    const ActionButton = ({
        isLoading,
        disabled,
        loadingText,
        text,
        type = "submit",
        onClick,
        className = "bg-green-600 hover:bg-green-500",
        icon = null
    }: {
        isLoading: boolean;
        disabled: boolean;
        loadingText: string;
        text: string;
        type?: "button" | "submit";
        onClick?: () => void;
        className?: string;
        icon?: React.ReactNode;
    }) => (
        <button
            type={type}
            onClick={onClick}
            disabled={isLoading || disabled}
            className={`px-4 py-2 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className} flex items-center justify-center space-x-2`}
        >
            {isLoading ? (
                <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                    <span>{loadingText}</span>
                </div>
            ) : (
                <>
                    {icon && <span>{icon}</span>}
                    <span>{text}</span>
                </>
            )}
        </button>
    );

    const PasswordStrengthIndicator = ({ strength }: { strength: number }) => {
        const getColor = () => {
            if (strength === 0) return "bg-zinc-700";
            if (strength === 1) return "bg-red-500";
            if (strength === 2) return "bg-orange-500";
            if (strength === 3) return "bg-yellow-500";
            return "bg-green-500";
        };

        const getMessage = () => {
            if (strength === 0) return "Enter password";
            if (strength === 1) return "Weak";
            if (strength === 2) return "Fair";
            if (strength === 3) return "Good";
            return "Strong";
        };

        return (
            <div className="mt-1 space-y-1">
                <div className="flex h-1.5 w-full space-x-1">
                    <div className={`h-full w-1/4 rounded-sm ${strength >= 1 ? getColor() : "bg-zinc-700"}`}></div>
                    <div className={`h-full w-1/4 rounded-sm ${strength >= 2 ? getColor() : "bg-zinc-700"}`}></div>
                    <div className={`h-full w-1/4 rounded-sm ${strength >= 3 ? getColor() : "bg-zinc-700"}`}></div>
                    <div className={`h-full w-1/4 rounded-sm ${strength >= 4 ? getColor() : "bg-zinc-700"}`}></div>
                </div>
                <p className="text-xs text-zinc-500">{getMessage()}</p>
            </div>
        );
    };

    const SectionCard = ({
        title,
        icon,
        iconColor = "text-green-400",
        children,
        className = ""
    }: {
        title: string;
        icon: React.ReactNode;
        iconColor?: string;
        children: React.ReactNode;
        className?: string;
    }) => (
        <div className={`p-6 rounded-xl border border-zinc-800 bg-zinc-900 space-y-4 transition-all duration-150 hover:border-zinc-700 ${className}`}>
            <div className="flex items-center space-x-3">
                <div className={iconColor}>{icon}</div>
                <h2 className="text-xl font-semibold text-white">{title}</h2>
            </div>
            {children}
        </div>
    );

    const SettingsContainer = ({ children }: { children: React.ReactNode }) => (
        <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 space-y-6">
            {children}
        </div>
    );

    // Main content renderer
    const renderContent = () => {
        if (!user) return null;

        return (
            <SettingsContainer>
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-white">Settings</h1>
                    <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-zinc-800">
                        <Shield size={18} className={user.is_verified ? "text-green-400" : "text-amber-500"} />
                        <span className={`text-sm ${user.is_verified ? "text-green-400" : "text-amber-500"}`}>
                            {user.is_verified ? "Verified Account" : "Unverified Account"}
                        </span>
                    </div>
                </div>

                {/* Email Settings */}
                <SectionCard title="Email Settings" icon={<Mail size={20} />}>
                    <form onSubmit={updateEmail} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
                                Email Address
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    id="email"
                                    value={emailSection.email}
                                    onChange={(e) => setEmailSection({
                                        ...emailSection,
                                        email: e.target.value,
                                        touched: true
                                    })}
                                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                    placeholder="your@email.com"
                                    required
                                />
                                {!user.is_verified && (
                                    <div className="absolute inset-y-0 right-3 flex items-center">
                                        <AlertCircle size={18} className="text-amber-500" />
                                    </div>
                                )}
                            </div>

                            {!user.is_verified && (
                                <p className="text-amber-500 text-sm flex items-center space-x-1">
                                    <span>Please verify your email address</span>
                                </p>
                            )}
                        </div>

                        <div className="flex items-center justify-end">
                            <ActionButton
                                isLoading={emailSection.updating}
                                disabled={emailSection.email === user.email || !emailSection.touched}
                                loadingText="Updating..."
                                text="Update Email"
                                icon={<Mail size={16} />}
                            />
                        </div>
                    </form>
                </SectionCard>

                {/* Password Settings */}
                <SectionCard title="Password Settings" icon={<Lock size={20} />}>
                    <form onSubmit={updatePassword} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="new-password" className="block text-sm font-medium text-zinc-300">
                                New Password
                            </label>
                            <input
                                type="password"
                                id="new-password"
                                value={passwordSection.newPassword}
                                onChange={(e) => {
                                    const newPassword = e.target.value;
                                    setPasswordSection({
                                        ...passwordSection,
                                        newPassword,
                                        passwordStrength: checkPasswordStrength(newPassword),
                                        touched: true
                                    });
                                }}
                                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                required
                                minLength={8}
                                placeholder="••••••••"
                            />
                            <PasswordStrengthIndicator strength={passwordSection.passwordStrength} />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="confirm-password" className="block text-sm font-medium text-zinc-300">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirm-password"
                                value={passwordSection.confirmPassword}
                                onChange={(e) => setPasswordSection({
                                    ...passwordSection,
                                    confirmPassword: e.target.value,
                                    touched: true
                                })}
                                className={`w-full px-4 py-3 bg-zinc-800 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${passwordSection.newPassword &&
                                    passwordSection.confirmPassword &&
                                    passwordSection.newPassword !== passwordSection.confirmPassword
                                    ? "border-red-500"
                                    : "border-zinc-700"
                                    }`}
                                required
                                minLength={8}
                                placeholder="••••••••"
                            />

                            {passwordSection.newPassword &&
                                passwordSection.confirmPassword &&
                                passwordSection.newPassword !== passwordSection.confirmPassword && (
                                    <p className="text-red-500 text-sm flex items-center space-x-1">
                                        <AlertCircle size={14} />
                                        <span>Passwords do not match</span>
                                    </p>
                                )}
                        </div>

                        <div className="pt-2 flex justify-end">
                            <ActionButton
                                isLoading={passwordSection.changing}
                                disabled={
                                    !passwordSection.newPassword ||
                                    !passwordSection.confirmPassword ||
                                    passwordSection.newPassword !== passwordSection.confirmPassword ||
                                    passwordSection.passwordStrength < 2 ||
                                    !passwordSection.touched
                                }
                                loadingText="Changing Password..."
                                text="Change Password"
                                icon={<Lock size={16} />}
                            />
                        </div>
                    </form>
                </SectionCard>

                {/* Notification Settings */}
                <SectionCard title="Notification Settings" icon={<Bell size={20} />}>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-zinc-300 font-medium">Email Notifications</h3>
                            <p className="text-sm text-zinc-500 mt-1">
                                Receive email notifications about security alerts, updates, and account activity.
                            </p>
                        </div>
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
                </SectionCard>

                {/* Danger Zone */}
                <SectionCard
                    title="Danger Zone"
                    icon={<Trash2 size={20} />}
                    iconColor="text-red-500"
                    className="border-red-900/20 bg-red-950/10 hover:border-red-900/30"
                >
                    <p className="text-sm text-zinc-400">
                        Once you delete your account, there is no going back. This will permanently erase all your data.
                    </p>

                    {showDeleteConfirm ? (
                        <div className="mt-6 p-4 border border-red-500/20 rounded-lg bg-red-950/20 space-y-4">
                            <p className="text-red-400 font-medium flex items-center space-x-2">
                                <AlertCircle size={18} />
                                <span>Are you sure you want to delete your account?</span>
                            </p>
                            <div className="flex space-x-3">
                                <ActionButton
                                    isLoading={deletingAccount}
                                    disabled={false}
                                    loadingText="Deleting..."
                                    text="Yes, Delete Account"
                                    type="button"
                                    onClick={deleteAccount}
                                    className="bg-red-600 hover:bg-red-500"
                                    icon={<Trash2 size={16} />}
                                />
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="px-4 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors flex items-center space-x-2"
                                >
                                    <span>Cancel</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="mt-2 px-4 py-2 bg-zinc-800 text-red-400 border border-red-900/30 rounded-lg hover:bg-red-900/20 transition-colors flex items-center space-x-2"
                        >
                            <Trash2 size={16} />
                            <span>Delete Account</span>
                        </button>
                    )}
                </SectionCard>
            </SettingsContainer>
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
                        borderRadius: '8px',
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
            <main
                className={`min-h-screen bg-black transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'
                    }`}
            >
                {loading ? <LoadingSpinner /> : renderContent()}
            </main>
        </>
    );
}
