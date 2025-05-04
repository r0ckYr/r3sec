"use client";

import React, { useEffect, useState } from "react";
import {
    LayoutDashboard,
    BarChart,
    FileCode,
    Shield,
    ChevronLeft,
    Settings,
    LogOut
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
    const pathname = usePathname();
    const router = useRouter();

    // Mark when component is hydrated and running on client
    useEffect(() => {
        setIsClient(true);
        // Call onToggle with initial state if provided
        onToggle?.(collapsed);
    }, [onToggle, collapsed]);

    const toggleSidebar = () => {
        const next = !collapsed;
        setCollapsed(next);
        // Save to localStorage
        localStorage.setItem("sidebarCollapsed", JSON.stringify(next));
        onToggle?.(next);
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
        { icon: <LayoutDashboard size={20} />, label: "Dashboard", href: "/dashboard" },
        { icon: <FileCode size={20} />, label: "Contracts", href: "/contracts" },
        { icon: <BarChart size={20} />, label: "Reports", href: "/reports" },
        { icon: <Settings size={20} />, label: "Settings", href: "/settings" },
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
                                    <div>{item.icon}</div>
                                    {!collapsed && <span className="ml-3 font-medium">{item.label}</span>}
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
