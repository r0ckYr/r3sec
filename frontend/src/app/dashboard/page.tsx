"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import {
    BarChart2,
    Shield,
    ChevronRight,
    AlertTriangle,
    Clock,
    Calendar,
    Activity,
    Upload,
    Plus
} from "lucide-react";

// Types
interface UserStats {
    user_id: string;
    email: string;
    created_at: string;
    contracts: {
        total_count: number;
        pending_count: number;
        in_progress_count: number;
        completed_count: number;
        failed_count: number;
        github_count: number;
        program_id_count: number;
        most_recent: {
            id: string;
            name: string;
            status: string;
            created_at: string;
        };
    };
    findings: {
        total_findings: number;
        severity_breakdown: {
            critical: number;
            high: number;
            medium: number;
            low: number;
            info: number;
        };
    };
    activity: {
        activity_counts: {
            last_24h: number;
            last_7d: number;
            last_30d: number;
        };
        activity_types: {
            [key: string]: number;
        };
        avg_completion_days: number;
        completed_contracts: number;
        account_age_days: number;
    };
}

export default function Dashboard() {
    const router = useRouter();
    const [stats, setStats] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
        fetchUserStats();
    }, []);

    const fetchUserStats = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${backendUrl}/api/user/stats`, {
                method: "GET",
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                if (response.status === 401) {
                    toast.error("Session expired. Please log in again.");
                    router.push("/");
                    return;
                }
                throw new Error(`Failed to fetch stats: ${response.status}`);
            }

            const statsData = await response.json();
            setStats(statsData);
        } catch (error: any) {
            console.error("Error fetching stats:", error);
            setError(error.message || "Failed to load user statistics");
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    const navigateToNewContract = () => {
        router.push("/contracts");
    };

    // Format date helper
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        } catch (e) {
            return "Invalid date";
        }
    };

    // Loading component
    const LoadingSpinner = () => (
        <div className="flex-1 bg-black p-6 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full border-4 border-zinc-700 border-t-green-400 animate-spin"></div>
        </div>
    );

    // Error component
    const ErrorDisplay = ({ message }: { message: string }) => (
        <div className="flex-1 bg-black p-6 flex flex-col items-center justify-center">
            <AlertTriangle size={40} className="text-amber-500 mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Something went wrong</h2>
            <p className="text-zinc-400">{message}</p>
            <button
                onClick={fetchUserStats}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors"
            >
                Retry
            </button>
        </div>
    );

    // Stats Card component
    const StatsCard = ({
        title,
        value,
        icon,
        trend,
        trendValue,
        color = "bg-gradient-to-br from-zinc-800 to-zinc-900"
    }: {
        title: string;
        value: string | number;
        icon: React.ReactNode;
        trend?: "up" | "down" | "neutral";
        trendValue?: string;
        color?: string;
    }) => (
        <div className={`rounded-xl border border-zinc-800 ${color} p-6 transition-all hover:shadow-lg hover:shadow-zinc-900/30`}>
            <div className="flex justify-between items-start">
                <div className="space-y-2">
                    <h3 className="text-zinc-400 font-medium text-sm">{title}</h3>
                    <p className="text-white text-2xl font-bold">{value}</p>
                    {trend && trendValue && (
                        <p className={`text-xs flex items-center ${trend === "up" ? "text-green-400" :
                            trend === "down" ? "text-red-400" :
                                "text-zinc-400"
                            }`}>
                            {trend === "up" ? "↑" : trend === "down" ? "↓" : "•"} {trendValue}
                        </p>
                    )}
                </div>
                <div className="p-3 bg-zinc-800/50 rounded-lg">
                    {icon}
                </div>
            </div>
        </div>
    );

    // Main content renderer
    const renderContent = () => {
        if (!stats) return null;

        // Safely access nested properties
        const safeGet = (obj: any, path: string, fallback: any = null) => {
            return path.split('.').reduce((acc, part) =>
                acc && acc[part] !== undefined ? acc[part] : fallback, obj);
        };

        // Contract stats
        const totalContracts = safeGet(stats, 'contracts.total_count', 0);
        const pendingContracts = safeGet(stats, 'contracts.pending_count', 0);
        const inProgressContracts = safeGet(stats, 'contracts.in_progress_count', 0);
        const completedContracts = safeGet(stats, 'contracts.completed_count', 0);
        const failedContracts = safeGet(stats, 'contracts.failed_count', 0);

        // GitHub vs ProgramID stats
        const githubContracts = safeGet(stats, 'contracts.github_count', 0);
        const programIdContracts = safeGet(stats, 'contracts.program_id_count', 0);

        // Most recent contract
        const mostRecentContract = safeGet(stats, 'contracts.most_recent', null);

        // Findings stats
        const totalFindings = safeGet(stats, 'findings.total_findings', 0);
        const criticalFindings = safeGet(stats, 'findings.severity_breakdown.critical', 0);
        const highFindings = safeGet(stats, 'findings.severity_breakdown.high', 0);
        const mediumFindings = safeGet(stats, 'findings.severity_breakdown.medium', 0);
        const lowFindings = safeGet(stats, 'findings.severity_breakdown.low', 0);
        const infoFindings = safeGet(stats, 'findings.severity_breakdown.info', 0);

        // Activity stats
        const activity24h = safeGet(stats, 'activity.activity_counts.last_24h', 0);
        const activity7d = safeGet(stats, 'activity.activity_counts.last_7d', 0);
        const activity30d = safeGet(stats, 'activity.activity_counts.last_30d', 0);
        const avgCompletionDays = safeGet(stats, 'activity.avg_completion_days', 0);
        const accountAgeDays = safeGet(stats, 'activity.account_age_days', 0);

        // Activity types
        const activityTypes = safeGet(stats, 'activity.activity_types', {});

        return (
            <div className="flex-1 bg-black p-6 space-y-6">
                {/* Header with New Contract Button */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                        <p className="text-zinc-400 text-sm">
                            Overview of your security audits and activity
                        </p>
                    </div>
                    <button
                        onClick={navigateToNewContract}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors"
                    >
                        <Plus size={18} />
                        <span>New Audit</span>
                    </button>
                </div>

                {/* Summary Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatsCard
                        title="Total Contracts"
                        value={totalContracts}
                        icon={<Shield size={24} className="text-green-400" />}
                    />
                    <StatsCard
                        title="Total Findings"
                        value={totalFindings}
                        icon={<AlertTriangle size={24} className="text-amber-400" />}
                    />
                    <StatsCard
                        title="Avg. Completion Time"
                        value={`${avgCompletionDays} days`}
                        icon={<Clock size={24} className="text-blue-400" />}
                    />
                    <StatsCard
                        title="Account Age"
                        value={`${accountAgeDays} days`}
                        icon={<Calendar size={24} className="text-purple-400" />}
                    />
                </div>

                {/* Contracts Overview */}
                <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900 space-y-4">
                    <div className="flex items-center space-x-3">
                        <BarChart2 size={20} className="text-green-400" />
                        <h2 className="text-xl font-semibold text-white">Contracts Overview</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-4 bg-zinc-800/50 rounded-lg">
                            <p className="text-sm text-zinc-400">Pending</p>
                            <p className="text-white text-2xl font-bold">{pendingContracts}</p>
                        </div>
                        <div className="p-4 bg-zinc-800/50 rounded-lg">
                            <p className="text-sm text-zinc-400">In Progress</p>
                            <p className="text-white text-2xl font-bold">{inProgressContracts}</p>
                        </div>
                        <div className="p-4 bg-zinc-800/50 rounded-lg">
                            <p className="text-sm text-zinc-400">Completed</p>
                            <p className="text-white text-2xl font-bold">{completedContracts}</p>
                        </div>
                        <div className="p-4 bg-zinc-800/50 rounded-lg">
                            <p className="text-sm text-zinc-400">Failed</p>
                            <p className="text-white text-2xl font-bold">{failedContracts}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="p-4 bg-zinc-800/30 rounded-lg">
                            <p className="text-sm text-zinc-400">Upload Types</p>
                            <div className="flex justify-between mt-2">
                                <div>
                                    <p className="text-xs text-zinc-500">GitHub</p>
                                    <p className="text-white font-semibold">{githubContracts}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-500">Contract Address</p>
                                    <p className="text-white font-semibold">{programIdContracts}</p>
                                </div>
                            </div>
                        </div>

                        {mostRecentContract && (
                            <div className="p-4 bg-zinc-800/30 rounded-lg">
                                <p className="text-sm text-zinc-400">Most Recent Contract</p>
                                <p className="text-white font-medium mt-1 truncate">{mostRecentContract.name}</p>
                                <div className="flex justify-between items-center mt-1">
                                    <span className={`px-2 py-0.5 text-xs rounded-full ${mostRecentContract.status === "completed" ? "bg-green-900/30 text-green-400" :
                                        mostRecentContract.status === "in_progress" ? "bg-blue-900/30 text-blue-400" :
                                            mostRecentContract.status === "pending" ? "bg-yellow-900/30 text-yellow-400" :
                                                "bg-red-900/30 text-red-400"
                                        }`}>
                                        {mostRecentContract.status}
                                    </span>
                                    <span className="text-xs text-zinc-500">
                                        {formatDate(mostRecentContract.created_at)}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Findings Breakdown */}
                <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900 space-y-4">
                    <div className="flex items-center space-x-3">
                        <AlertTriangle size={20} className="text-amber-400" />
                        <h2 className="text-xl font-semibold text-white">Findings Breakdown</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div className="p-4 bg-red-900/20 border border-red-800/30 rounded-lg">
                            <p className="text-sm text-zinc-400">Critical</p>
                            <p className="text-red-400 text-2xl font-bold">{criticalFindings}</p>
                        </div>
                        <div className="p-4 bg-orange-900/20 border border-orange-800/30 rounded-lg">
                            <p className="text-sm text-zinc-400">High</p>
                            <p className="text-orange-400 text-2xl font-bold">{highFindings}</p>
                        </div>
                        <div className="p-4 bg-amber-900/20 border border-amber-800/30 rounded-lg">
                            <p className="text-sm text-zinc-400">Medium</p>
                            <p className="text-amber-400 text-2xl font-bold">{mediumFindings}</p>
                        </div>
                        <div className="p-4 bg-blue-900/20 border border-blue-800/30 rounded-lg">
                            <p className="text-sm text-zinc-400">Low</p>
                            <p className="text-blue-400 text-2xl font-bold">{lowFindings}</p>
                        </div>
                        <div className="p-4 bg-green-900/20 border border-green-800/30 rounded-lg">
                            <p className="text-sm text-zinc-400">Info</p>
                            <p className="text-green-400 text-2xl font-bold">{infoFindings}</p>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900 space-y-4">
                    <div className="flex items-center space-x-3">
                        <Activity size={20} className="text-blue-400" />
                        <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-zinc-800/50 rounded-lg">
                            <p className="text-sm text-zinc-400">Last 24 Hours</p>
                            <p className="text-white text-2xl font-bold">{activity24h}</p>
                        </div>
                        <div className="p-4 bg-zinc-800/50 rounded-lg">
                            <p className="text-sm text-zinc-400">Last 7 Days</p>
                            <p className="text-white text-2xl font-bold">{activity7d}</p>
                        </div>
                        <div className="p-4 bg-zinc-800/50 rounded-lg">
                            <p className="text-sm text-zinc-400">Last 30 Days</p>
                            <p className="text-white text-2xl font-bold">{activity30d}</p>
                        </div>
                    </div>

                    {Object.keys(activityTypes).length > 0 && (
                        <div className="mt-4">
                            <p className="text-sm text-zinc-400 mb-2">Activity Types</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {Object.entries(activityTypes).map(([type, count]) => (
                                    <div key={type} className="flex justify-between p-3 bg-zinc-800/30 rounded-lg">
                                        <span className="text-zinc-300">{type}</span>
                                        <span className="text-white font-medium">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 rounded-xl border border-green-800/20 bg-green-900/10 hover:bg-green-900/20 transition-colors cursor-pointer" onClick={navigateToNewContract}>
                        <div className="flex items-start justify-between">
                            <div className="space-y-2">
                                <div className="flex items-center space-x-3">
                                    <Upload size={20} className="text-green-400" />
                                    <h3 className="text-lg font-semibold text-white">New Contract Audit</h3>
                                </div>
                                <p className="text-zinc-400 text-sm">Upload a new contract for security audit</p>
                            </div>
                            <ChevronRight size={20} className="text-green-400" />
                        </div>
                    </div>

                    <div className="p-6 rounded-xl border border-blue-800/20 bg-blue-900/10 hover:bg-blue-900/20 transition-colors cursor-pointer" onClick={() => router.push("/reports")}>
                        <div className="flex items-start justify-between">
                            <div className="space-y-2">
                                <div className="flex items-center space-x-3">
                                    <BarChart2 size={20} className="text-blue-400" />
                                    <h3 className="text-lg font-semibold text-white">View Reports</h3>
                                </div>
                                <p className="text-zinc-400 text-sm">See detailed security reports for your contracts</p>
                            </div>
                            <ChevronRight size={20} className="text-blue-400" />
                        </div>
                    </div>
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
                className={`min-h-screen transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}
            >
                {loading ? (
                    <LoadingSpinner />
                ) : error ? (
                    <ErrorDisplay message={error} />
                ) : (
                    renderContent()
                )}
            </div>
        </>
    );
}
