"use client";

import React, { useEffect, useState, useRef } from "react";
import {
    LayoutDashboard,
    BarChart,
    FileCode,
    Shield,
    ChevronLeft,
    Settings,
    MessageSquare,
    LogOut,
    Bell,
    CheckSquare,
    X
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";

// Function to get initial sidebar state from localStorage (runs on the client)
const getInitialSidebarState = () => {
    if (typeof window !== 'undefined') {
        const savedState = localStorage.getItem("sidebarCollapsed");
        return savedState !== null ? JSON.parse(savedState) : false;
    }
    return false;
};

export default function Sidebar({ onToggle }: { onToggle?: (collapsed: boolean) => void }) {
    // Initialize state with the value from localStorage directly
    const [collapsed, setCollapsed] = useState(getInitialSidebarState());
    const [userEmail, setUserEmail] = useState("");
    const [isClient, setIsClient] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
    const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
    const notificationRef = useRef(null);
    const pathname = usePathname();
    const router = useRouter();

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

    // Mark when component is hydrated and running on client
    useEffect(() => {
        setIsClient(true);
        // Call onToggle with initial state if provided
        onToggle?.(collapsed);
    }, [onToggle, collapsed]);

    // Fetch notifications and unread messages count
    useEffect(() => {
        if (isClient) {
            fetchNotifications();
            fetchUnreadMessagesCount();

            // Set up polling interval for notifications
            const interval = setInterval(() => {
                fetchNotifications();
                fetchUnreadMessagesCount();
            }, 60000); // Poll every minute

            return () => clearInterval(interval);
        }
    }, [isClient]);

    // Close notification dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setNotificationDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/notifications`, {
                method: "GET",
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                if (response.status === 401) {
                    // Handle unauthorized
                    return;
                }
                throw new Error(`Failed to fetch notifications: ${response.status}`);
            }

            const data = await response.json();
            setNotifications(data.notifications || []);
            setUnreadCount(data.unread_count || 0);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    const fetchUnreadMessagesCount = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/user/unread-messages`, {
                method: "GET",
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                if (response.status === 401) {
                    // Handle unauthorized
                    return;
                }
                throw new Error(`Failed to fetch unread messages count: ${response.status}`);
            }

            const data = await response.json();
            setUnreadMessagesCount(data.unread_count || 0);
        } catch (error) {
            console.error("Error fetching unread messages count:", error);
        }
    };

    const markNotificationAsRead = async (notificationId) => {
        try {
            const response = await fetch(`${backendUrl}/api/notifications/${notificationId}/read`, {
                method: "POST",
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Failed to mark notification as read: ${response.status}`);
            }

            // Update local state
            setNotifications(prev =>
                prev.map(notification =>
                    notification.id === notificationId
                        ? { ...notification, is_read: true }
                        : notification
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const toggleSidebar = () => {
        const next = !collapsed;
        setCollapsed(next);
        // Save to localStorage
        localStorage.setItem("sidebarCollapsed", JSON.stringify(next));
        onToggle?.(next);
    };

    // Format date helper
    const formatNotificationTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMin = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMin < 1) return 'Just now';
        if (diffMin < 60) return `${diffMin}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    // Check if JWT token is valid and not expired
    const validateToken = () => {
        try {
            const token = localStorage.getItem("authToken");
            if (!token) {
                return false;
            }
            const payload = JSON.parse(atob(token.split(".")[1]));
            return payload.exp * 1000 > Date.now();
        } catch (error) {
            console.error("Token validation error:", error);
            return false;
        }
    };

    // Handle logout functionality
    const handleLogout = () => {
        // Clear user data from localStorage
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        // Note: We keep sidebarCollapsed state even after logout

        // Redirect to home page
        router.push("/");

        // Show notification
        toast.success("Successfully logged out");
    };

    useEffect(() => {
        // Validate token on component mount
        if (!validateToken()) {
            // Clear invalid token and user data
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");

            // Redirect to login page
            router.push("/");

            // Show notification
            toast.error("Please login to continue");
            return;
        }

        // Set user email if token is valid
        const user = localStorage.getItem("user");
        if (user) {
            try {
                const parsed = JSON.parse(user);
                setUserEmail(parsed.email || "");
            } catch (err) {
                console.error("Invalid user in localStorage");
            }
        }
    }, [router]);

    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: "Dashboard", href: "/dashboard", badge: null },
        { icon: <FileCode size={20} />, label: "Contracts", href: "/contracts", badge: null },
        { icon: <BarChart size={20} />, label: "Reports", href: "/reports", badge: null },
        { icon: <MessageSquare size={20} />, label: "Chat", href: "/chat", badge: null },
        { icon: <Settings size={20} />, label: "Settings", href: "/settings", badge: null },
    ];

    // Only render the component once we're on the client
    // This prevents hydration mismatches
    if (!isClient) {
        return null; // Return nothing during SSR or before hydration
    }

    return (
        <div className="flex">
            <div
                className={`fixed top-0 left-0 h-screen bg-zinc-900 border-r border-zinc-800 flex flex-col transition-all duration-300 z-50 ${collapsed ? "w-20" : "w-64"
                    }`}
            >
                {/* Collapse button */}
                <button
                    onClick={toggleSidebar}
                    className="absolute -right-3 top-14 bg-zinc-800 p-1 rounded-full border border-zinc-700 hover:bg-green-500 hover:border-green-400 transition"
                >
                    <ChevronLeft size={16} className={`text-white ${collapsed ? "rotate-180" : ""} transition-transform`} />
                </button>

                {/* Logo */}
                <div className="p-6 flex items-center justify-center">
                    <div className="bg-black p-2 rounded-lg">
                        <h1 className={`tracking-tight font-bold ${collapsed ? "text-xl" : "text-2xl"}`}>
                            <span className="text-white">R3</span>
                            <span className="text-green-400">SEC</span>
                        </h1>
                    </div>
                </div>

                {/* Notification icon (only shown when not collapsed) */}
                {!collapsed && (
                    <div className="px-6 relative" ref={notificationRef}>
                        <button
                            onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
                            className="w-full py-2 px-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors flex items-center justify-between"
                        >
                            <div className="flex items-center">
                                <Bell size={18} className="text-zinc-400" />
                                <span className="ml-2 text-zinc-300">Notifications</span>
                            </div>
                            {unreadCount > 0 && (
                                <span className="bg-green-500 text-white text-xs font-medium rounded-full px-2 py-0.5">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {/* Notification dropdown */}
                        {notificationDropdownOpen && (
                            <div className="absolute left-6 right-6 mt-2 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                                <div className="p-3 border-b border-zinc-700 flex items-center justify-between">
                                    <h3 className="text-white font-medium">Recent Notifications</h3>
                                    <button
                                        onClick={() => setNotificationDropdownOpen(false)}
                                        className="text-zinc-400 hover:text-white"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>

                                {notifications.length === 0 ? (
                                    <div className="p-4 text-center text-zinc-400">
                                        <p>No notifications</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-zinc-700">
                                        {notifications.map((notification) => (
                                            <div
                                                key={notification.id}
                                                className={`p-3 hover:bg-zinc-700/50 transition-colors ${notification.is_read ? 'opacity-70' : ''}`}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <p className="text-sm text-white font-medium">{notification.title}</p>
                                                        <p className="text-xs text-zinc-400 mt-1">{notification.body}</p>
                                                        <div className="flex items-center text-xs text-zinc-500 mt-2">
                                                            <span>{formatNotificationTime(notification.created_at)}</span>
                                                            {!notification.is_read && (
                                                                <span className="ml-2 inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {!notification.is_read && (
                                                        <button
                                                            onClick={() => markNotificationAsRead(notification.id)}
                                                            className="ml-2 p-1 text-zinc-400 hover:text-green-400 rounded-md hover:bg-zinc-600/50"
                                                            title="Mark as read"
                                                        >
                                                            <CheckSquare size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Notification icon (only shown when collapsed) */}
                {collapsed && (
                    <div className="relative flex justify-center mt-6 mb-4" ref={notificationRef}>
                        <button
                            onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
                            className="p-2 mx-auto relative text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors flex flex-col items-center"
                        >
                            <Bell size={22} className={unreadCount > 0 ? "text-green-400" : "text-zinc-400"} />
                            {unreadCount > 0 && (
                                <span className="mt-1 bg-green-500 text-white text-xs font-medium rounded-full px-2 py-0.5 min-w-5 text-center">
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                </span>
                            )}
                        </button>

                        {/* Notification dropdown */}
                        {notificationDropdownOpen && (
                            <div className="absolute left-full ml-3 top-0 w-80 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl max-h-[80vh] overflow-y-auto z-50">
                                <div className="sticky top-0 p-3 border-b border-zinc-700 flex items-center justify-between bg-zinc-800 z-10">
                                    <h3 className="text-white font-medium">Recent Notifications</h3>
                                    <button
                                        onClick={() => setNotificationDropdownOpen(false)}
                                        className="text-zinc-400 hover:text-white p-1 rounded-md hover:bg-zinc-700"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>

                                {notifications.length === 0 ? (
                                    <div className="p-6 text-center text-zinc-400">
                                        <Bell size={32} className="mx-auto mb-2 text-zinc-600" />
                                        <p>No notifications</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-zinc-700">
                                        {notifications.map((notification) => (
                                            <div
                                                key={notification.id}
                                                className={`p-3 hover:bg-zinc-700/50 transition-colors ${notification.is_read ? 'opacity-70' : ''}`}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <p className="text-sm text-white font-medium">{notification.title}</p>
                                                        <p className="text-xs text-zinc-400 mt-1">{notification.body}</p>
                                                        <div className="flex items-center text-xs text-zinc-500 mt-2">
                                                            <span>{formatNotificationTime(notification.created_at)}</span>
                                                            {!notification.is_read && (
                                                                <span className="ml-2 inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {!notification.is_read && (
                                                        <button
                                                            onClick={() => markNotificationAsRead(notification.id)}
                                                            className="ml-2 p-1 text-zinc-400 hover:text-green-400 rounded-md hover:bg-zinc-600/50"
                                                            title="Mark as read"
                                                        >
                                                            <CheckSquare size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Menu */}
                <nav className="flex-1 mt-6">
                    <ul className="space-y-2 px-3">
                        {menuItems.map((item, i) => (
                            <li key={i}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center px-3 py-3 rounded-lg transition-all duration-200 ${pathname === item.href
                                        ? "bg-green-500/10 text-green-400"
                                        : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                                        }`}
                                >
                                    <div className="relative">
                                        {item.icon}
                                        {item.badge && (
                                            <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-medium rounded-full min-w-5 h-5 flex items-center justify-center px-1">
                                                {item.badge > 9 ? '9+' : item.badge}
                                            </span>
                                        )}
                                    </div>
                                    {!collapsed && (
                                        <span className="ml-3 font-medium flex-1">
                                            {item.label}
                                            {item.badge && (
                                                <span className="ml-auto bg-green-500 text-white text-xs font-medium rounded-full px-2 py-0.5">
                                                    {item.badge}
                                                </span>
                                            )}
                                        </span>
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Status */}
                <div className={`px-3 py-4 ${collapsed ? "mx-2" : "mx-4"} mb-4 bg-zinc-800 rounded-lg`}>
                    <div className="flex items-center justify-center">
                        <Shield size={20} className="text-green-400" />
                        {!collapsed && (
                            <div className="ml-3">
                                <div className="text-xs text-zinc-400">Security Status</div>
                                <div className="text-sm font-medium text-white">Protected</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* User */}
                <div className={`p-4 border-t border-zinc-800 flex items-center ${collapsed ? "justify-center" : ""}`}>
                    <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                        <span className="text-xs font-medium text-white">{userEmail?.charAt(0)?.toUpperCase() || "U"}</span>
                    </div>
                    {!collapsed && (
                        <>
                            <div className="ml-3 mr-auto">
                                <div className="text-sm font-medium text-white truncate">{userEmail || "User"}</div>
                                <div className="text-xs text-zinc-400">Logged In</div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-1 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white"
                                aria-label="Logout"
                            >
                                <LogOut size={18} />
                            </button>
                        </>
                    )}
                    {collapsed && (
                        <button
                            onClick={handleLogout}
                            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 p-2 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white mt-2"
                            aria-label="Logout"
                        >
                            <LogOut size={18} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
