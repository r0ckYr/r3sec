"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import {
    Shield,
    AlertTriangle,
    Clock,
    FileText,
    Download,
    ChevronRight,
    X,
    CheckCircle,
    AlertCircle,
    CircleDashed,
    ExternalLink,
    Eye,
    BarChart,
    FileSearch
} from "lucide-react";

// Types
interface Report {
    id: string;
    contract_id: string;
    contract_name: string;
    uploaded_by: string;
    report_url: string;
    summary: string;
    severity_summary: string;
    findings_count: number;
    uploaded_at: string;
    updated_at: string;
}

interface Contract {
    id: string;
    name: string;
    status: string;
}

export default function Reports() {
    const router = useRouter();
    const [reports, setReports] = useState<Report[]>([]);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [reportDetails, setReportDetails] = useState<{
        report: Report;
        contract?: Contract;
    } | null>(null);

    const [loading, setLoading] = useState(true);
    const [detailLoading, setDetailLoading] = useState(false);
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
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${backendUrl}/api/reports`, {
                method: "GET",
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                if (response.status === 401) {
                    toast.error("Session expired. Please log in again.");
                    router.push("/");
                    return;
                }
                throw new Error(`Failed to fetch reports: ${response.status}`);
            }

            const data = await response.json();
            setReports(data.reports || []);
        } catch (error: any) {
            console.error("Error fetching reports:", error);
            setError(error.message || "Failed to load reports");
            toast.error("Failed to load reports");
        } finally {
            setLoading(false);
        }
    };

    const fetchReportDetails = async (reportId: string) => {
        try {
            setDetailLoading(true);
            setError(null);

            const response = await fetch(`${backendUrl}/api/reports/${reportId}`, {
                method: "GET",
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                if (response.status === 401) {
                    toast.error("Session expired. Please log in again.");
                    router.push("/");
                    return;
                }
                throw new Error(`Failed to fetch report details: ${response.status}`);
            }

            const data = await response.json();
            setReportDetails(data);
        } catch (error: any) {
            console.error("Error fetching report details:", error);
            setError(error.message || "Failed to load report details");
            toast.error("Failed to load report details");
        } finally {
            setDetailLoading(false);
        }
    };

    const downloadReport = async (reportId: string) => {
        try {
            const response = await fetch(`${backendUrl}/api/reports/${reportId}/download`, {
                method: "GET",
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to get download link");
            }

            const data = await response.json();

            // Open the download URL in a new tab
            window.open(data.download_url, "_blank");
        } catch (error: any) {
            console.error("Error downloading report:", error);
            toast.error(error.message || "Failed to download report");
        }
    };

    // Format date helper
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            });
        } catch (e) {
            return "Invalid date";
        }
    };

    // Parse severity summary
    const parseSeveritySummary = (summary: string) => {
        const severities = {
            critical: 0,
            high: 0,
            medium: 0,
            low: 0,
            info: 0
        };

        if (!summary) return severities;

        // Parse strings like "High: 1, Medium: 1, Low: 1"
        const parts = summary.split(", ");
        parts.forEach(part => {
            const [severity, count] = part.split(": ");
            const severityLower = severity.toLowerCase();
            if (severityLower in severities) {
                severities[severityLower] = parseInt(count);
            }
        });

        return severities;
    };

    // Get severity color class
    const getSeverityColor = (severity: string) => {
        switch (severity.toLowerCase()) {
            case 'critical':
                return "bg-red-900/20 border-red-800/30 text-red-400";
            case 'high':
                return "bg-orange-900/20 border-orange-800/30 text-orange-400";
            case 'medium':
                return "bg-amber-900/20 border-amber-800/30 text-amber-400";
            case 'low':
                return "bg-blue-900/20 border-blue-800/30 text-blue-400";
            case 'info':
                return "bg-green-900/20 border-green-800/30 text-green-400";
            default:
                return "bg-zinc-900/20 border-zinc-800/30 text-zinc-400";
        }
    };

    // Loading spinner component
    const LoadingSpinner = () => (
        <div className="flex-1 bg-black p-6 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full border-4 border-zinc-700 border-t-green-400 animate-spin"></div>
        </div>
    );

    // Error display component
    const ErrorDisplay = ({ message }: { message: string }) => (
        <div className="flex-1 bg-black p-6 flex flex-col items-center justify-center">
            <AlertTriangle size={40} className="text-amber-500 mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Something went wrong</h2>
            <p className="text-zinc-400">{message}</p>
            <button
                onClick={fetchReports}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors"
            >
                Retry
            </button>
        </div>
    );

    // Render the reports list view
    const renderReportsList = () => {
        if (reports.length === 0) {
            return (
                <div className="text-center py-12">
                    <FileSearch size={48} className="text-zinc-700 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Reports Yet</h3>
                    <p className="text-zinc-400 mb-6">You don't have any audit reports available yet</p>
                    <button
                        onClick={() => router.push('/contracts')}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors inline-flex items-center space-x-2"
                    >
                        <Shield size={18} />
                        <span>Go to Contracts</span>
                    </button>
                </div>
            );
        }

        return (
            <div className="space-y-3">
                {reports.map((report) => (
                    <div
                        key={report.id}
                        onClick={() => {
                            setSelectedReport(report);
                            fetchReportDetails(report.id);
                        }}
                        className={`p-4 border rounded-lg transition-all cursor-pointer hover:bg-zinc-900/50 ${selectedReport && selectedReport.id === report.id
                            ? "border-green-500/50 bg-zinc-900/50"
                            : "border-zinc-800 bg-zinc-900/20"
                            }`}
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                    <FileText size={16} className="text-green-400" />
                                    <h3 className="font-medium text-white">{report.contract_name}</h3>
                                </div>
                                <div className="flex items-center space-x-2 text-xs text-zinc-400">
                                    <span className="flex items-center">
                                        <BarChart size={12} className="mr-1" />
                                        <span>Findings: {report.findings_count}</span>
                                    </span>
                                    <span>•</span>
                                    <span>{formatDate(report.uploaded_at)}</span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="px-2 py-0.5 text-xs rounded-full bg-green-900/30 text-green-400">
                                    Report Available
                                </span>
                                <ChevronRight size={16} className="text-zinc-500" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    // Render report details
    const renderReportDetails = () => {
        if (!selectedReport) return null;

        const severities = parseSeveritySummary(selectedReport.severity_summary);

        return (
            <div className="space-y-6">
                {/* Header with actions */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                        <div className="flex items-center space-x-3">
                            <h2 className="text-xl font-bold text-white">{selectedReport.contract_name} Report</h2>
                            <span className="px-2 py-0.5 text-xs rounded-full bg-green-900/30 text-green-400">
                                Completed
                            </span>
                        </div>
                        <p className="text-zinc-400 text-sm mt-1">
                            Uploaded {formatDate(selectedReport.uploaded_at)}
                            {selectedReport.updated_at !== selectedReport.uploaded_at && ` • Updated ${formatDate(selectedReport.updated_at)}`}
                        </p>
                    </div>

                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => downloadReport(selectedReport.id)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors flex items-center space-x-2"
                        >
                            <Download size={16} />
                            <span>Download Report</span>
                        </button>
                    </div>
                </div>

                {/* Report details */}
                <div className="grid grid-cols-1 gap-6">
                    <div className="p-5 border border-zinc-800 rounded-lg bg-zinc-900/50">
                        <h3 className="text-lg font-medium text-white mb-4">Report Summary</h3>

                        <div className="space-y-5">
                            <div>
                                <p className="text-zinc-400 text-sm mb-2">Overview</p>
                                <p className="text-white">
                                    {selectedReport.summary || "No summary provided for this report."}
                                </p>
                            </div>

                            <div>
                                <p className="text-zinc-400 text-sm mb-2">Findings Overview</p>

                                <div className="mb-2 bg-zinc-800/50 p-2 rounded-lg text-center">
                                    <p className="text-xs text-zinc-400">Total Findings</p>
                                    <p className="text-white text-xl font-bold">{selectedReport.findings_count}</p>
                                </div>

                                <div className="grid grid-cols-5 gap-2">
                                    <div className="p-2 bg-red-900/20 border border-red-800/30 rounded-lg text-center">
                                        <p className="text-xs text-zinc-400">Critical</p>
                                        <p className="text-red-400 text-lg font-bold">{severities.critical}</p>
                                    </div>
                                    <div className="p-2 bg-orange-900/20 border border-orange-800/30 rounded-lg text-center">
                                        <p className="text-xs text-zinc-400">High</p>
                                        <p className="text-orange-400 text-lg font-bold">{severities.high}</p>
                                    </div>
                                    <div className="p-2 bg-amber-900/20 border border-amber-800/30 rounded-lg text-center">
                                        <p className="text-xs text-zinc-400">Medium</p>
                                        <p className="text-amber-400 text-lg font-bold">{severities.medium}</p>
                                    </div>
                                    <div className="p-2 bg-blue-900/20 border border-blue-800/30 rounded-lg text-center">
                                        <p className="text-xs text-zinc-400">Low</p>
                                        <p className="text-blue-400 text-lg font-bold">{severities.low}</p>
                                    </div>
                                    <div className="p-2 bg-green-900/20 border border-green-800/30 rounded-lg text-center">
                                        <p className="text-xs text-zinc-400">Info</p>
                                        <p className="text-green-400 text-lg font-bold">{severities.info}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <p className="text-zinc-400 text-sm">Report Details</p>
                                <div className="mt-2 space-y-2">
                                    <div className="flex justify-between py-2 border-b border-zinc-800">
                                        <span className="text-zinc-400">Contract ID</span>
                                        <span className="text-white font-mono text-sm">{selectedReport.contract_id}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-zinc-800">
                                        <span className="text-zinc-400">Report ID</span>
                                        <span className="text-white font-mono text-sm">{selectedReport.id}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-zinc-800">
                                        <span className="text-zinc-400">Upload Date</span>
                                        <span className="text-white">{formatDate(selectedReport.uploaded_at)}</span>
                                    </div>
                                    {selectedReport.report_url && (
                                        <div className="flex justify-between py-2">
                                            <span className="text-zinc-400">Report Link</span>
                                            <a
                                                href={selectedReport.report_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-green-400 hover:underline flex items-center"
                                            >
                                                View Original
                                                <ExternalLink size={14} className="ml-1 inline-block" />
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contract link */}
                <div className="p-5 border border-zinc-800 rounded-lg bg-zinc-900/50">
                    <h3 className="text-lg font-medium text-white mb-4">Related Contract</h3>
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-white font-medium">{selectedReport.contract_name}</p>
                            <p className="text-zinc-400 text-sm">Contract ID: {selectedReport.contract_id}</p>
                        </div>
                        <button
                            onClick={() => router.push(`/contracts?id=${selectedReport.contract_id}`)}
                            className="px-3 py-1.5 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors flex items-center space-x-2"
                        >
                            <Eye size={16} />
                            <span>View Contract</span>
                        </button>
                    </div>
                </div>

                {/* Go back button */}
                <button
                    onClick={() => {
                        setSelectedReport(null);
                        setReportDetails(null);
                    }}
                    className="mt-4 flex items-center text-zinc-400 hover:text-white transition-colors"
                >
                    <ChevronRight size={16} className="rotate-180 mr-1" />
                    <span>Back to reports</span>
                </button>
            </div>
        );
    };

    // Main content renderer
    const renderContent = () => {
        return (
            <div className="flex-1 bg-black p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Audit Reports</h1>
                        <p className="text-zinc-400 text-sm">
                            View and download security audit reports for your contracts
                        </p>
                    </div>
                    <button
                        onClick={() => router.push('/contracts')}
                        className="flex items-center space-x-2 px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
                    >
                        <Shield size={18} />
                        <span>Manage Contracts</span>
                    </button>
                </div>

                {/* Main content area with list/detail view */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className={`md:col-span-1 ${selectedReport ? 'hidden md:block' : ''}`}>
                        <div className="p-5 border border-zinc-800 rounded-lg bg-zinc-900/50 h-full">
                            <h2 className="text-lg font-medium text-white mb-4">Your Reports</h2>
                            {loading ? (
                                <div className="flex justify-center py-8">
                                    <div className="h-6 w-6 rounded-full border-2 border-zinc-700 border-t-green-400 animate-spin"></div>
                                </div>
                            ) : error ? (
                                <div className="text-center py-6">
                                    <AlertTriangle size={24} className="text-amber-500 mx-auto mb-2" />
                                    <p className="text-zinc-400">{error}</p>
                                    <button
                                        onClick={fetchReports}
                                        className="mt-3 px-3 py-1 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors text-sm"
                                    >
                                        Retry
                                    </button>
                                </div>
                            ) : (
                                renderReportsList()
                            )}
                        </div>
                    </div>

                    <div className={`md:col-span-2 ${selectedReport ? '' : 'hidden md:block'}`}>
                        {selectedReport ? (
                            <div className="p-5 border border-zinc-800 rounded-lg bg-zinc-900/50">
                                {detailLoading ? (
                                    <div className="flex justify-center py-12">
                                        <div className="h-6 w-6 rounded-full border-2 border-zinc-700 border-t-green-400 animate-spin"></div>
                                    </div>
                                ) : (
                                    renderReportDetails()
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full p-12 border border-zinc-800 rounded-lg bg-zinc-900/50">
                                <FileSearch size={48} className="text-zinc-700 mb-4" />
                                <h3 className="text-xl font-semibold text-white mb-2">Select a Report</h3>
                                <p className="text-zinc-400 text-center">
                                    Choose a report from the list to view its details and download it
                                </p>
                            </div>
                        )}
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
                {loading && !selectedReport ? (
                    <LoadingSpinner />
                ) : error && !selectedReport ? (
                    <ErrorDisplay message={error} />
                ) : (
                    renderContent()
                )}
            </div>
        </>
    );
}
