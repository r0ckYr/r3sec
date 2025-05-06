"use client";

import React, { useState, useEffect } from "react";
import {
    LayoutDashboard,
    Users,
    FileCode,
    Settings,
    LogOut,
    Shield,
    ChevronLeft,
    Inbox,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

// Function to get initial sidebar state from localStorage
const getInitialSidebarState = () => {
    if (typeof window !== 'undefined') {
        const savedState = localStorage.getItem("adminSidebarCollapsed");
        return savedState !== null ? JSON.parse(savedState) : false;
    }
    return false;
};

export default function AdminSidebar({ onToggle }: { onToggle?: (collapsed: boolean) => void }) {
    // Initialize state with the value from localStorage
    const [collapsed, setCollapsed] = useState(getInitialSidebarState());
    const [adminEmail, setAdminEmail] = useState("");
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
        localStorage.setItem("adminSidebarCollapsed", JSON.stringify(next));
        onToggle?.(next);
    };

    // Handle logout functionality
    const handleLogout = () => {
        // Clear admin data from localStorage
        localStorage.removeItem("adminAuthToken");
        localStorage.removeItem("admin");

        //  admin login page
        router.push("/");
    };

    useEffect(() => {
        // Set admin email if it exists in localStorage
        const admin = localStorage.getItem("admin");
        if (admin) {
            try {
                const parsed = JSON.parse(admin);
                setAdminEmail(parsed.email || "");
            } catch (err) {
                console.error("Invalid admin in localStorage");
            }
        }
    }, []);

    const menuItems = [
        // { icon: <LayoutDashboard size={20} />, label: "Dashboard", href: "/dashboard" },
        { icon: <FileCode size={20} />, label: "Contracts", href: "/contracts" },
        { icon: <Users size={20} />, label: "Users", href: "/users" },
        { icon: <Inbox size={20} />, label: "Inbox", href: "/inbox" },
    ];

    // Only render the component once we're on the client
    // This prevents hydration mismatches
    if (!isClient) {
        return null;
    }

    return (
        <div className="flex">
            <div
                className={`fixed top-0 left-0 h-screen bg-zinc-900 border-r border-zinc-800 flex flex-col transition-all duration-300 z-50 ${collapsed ? "w-20" : "w-64"}`}
            >
                {/* Collapse button */}
                <button
                    onClick={toggleSidebar}
                    className="absolute -right-3 top-14 bg-zinc-800 p-1 rounded-full border border-zinc-700 hover:bg-blue-500 hover:border-blue-400 transition"
                >
                    <ChevronLeft size={16} className={`text-white ${collapsed ? "rotate-180" : ""} transition-transform`} />
                </button>

                {/* Logo */}
                <div className="p-6 flex items-center justify-center">
                    <div className="bg-black p-2 rounded-lg">
                        <h1 className={`tracking-tight font-bold ${collapsed ? "text-xl" : "text-2xl"}`}>
                            <span className="text-white">R3</span>
                            <span className="text-blue-400">SEC</span>
                            {!collapsed && <span className="text-xs text-zinc-500 ml-1">admin</span>}
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
                                        ? "bg-blue-900/20 text-blue-400"
                                        : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                                        }`}
                                >
                                    <div className="relative">
                                        {item.icon}
                                    </div>
                                    {!collapsed && (
                                        <span className="ml-3 font-medium flex-1">
                                            {item.label}
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
                        <Shield size={20} className="text-blue-400" />
                        {!collapsed && (
                            <div className="ml-3">
                                <div className="text-xs text-zinc-400">Admin Access</div>
                                <div className="text-sm font-medium text-white">Full Control</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* User */}
                <div className={`p-4 border-t border-zinc-800 flex items-center ${collapsed ? "justify-center" : ""}`}>
                    <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center">
                        <span className="text-xs font-medium text-white">{adminEmail?.charAt(0)?.toUpperCase() || "A"}</span>
                    </div>
                    {!collapsed && (
                        <>
                            <div className="ml-3 mr-auto">
                                <div className="text-sm font-medium text-white truncate">{adminEmail || "Admin"}</div>
                                <div className="text-xs text-zinc-400">Administrator</div>
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
