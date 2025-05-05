"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import {
    Shield,
    AlertTriangle,
    Clock,
    FileText,
    Plus,
    ChevronRight,
    X,
    CheckCircle,
    AlertCircle,
    CircleDashed,
    Upload,
    Calendar,
    Download,
    ExternalLink,
    Eye,
    RefreshCw,
    Trash2
} from "lucide-react";

// Types
interface Contract {
    id: string;
    name: string;
    description: string;
    upload_type: string;
    upload_url: string;
    status: string;
    created_at: string;
    updated_at: string;
}

interface Finding {
    id: string;
    report_id: string;
    title: string;
    description: string;
    severity: string;
    location: string;
    recommendation: string;
    created_at: string;
}

interface AuditReport {
    id: string;
    contract_id: string;
    report_url: string;
    total_findings: number;
    findings_count: number;
    severity_breakdown: {
        critical: number;
        high: number;
        medium: number;
        low: number;
        info: number;
    };
    uploaded_at: string;
    status: string;
}

interface AuditLog {
    id: string;
    contract_id: string;
    event: string;
    actor_id: string;
    actor_role: string;
    created_at: string;
}

export default function Contracts() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
    const [contractDetails, setContractDetails] = useState<{
        contract: Contract;
        audit_report?: AuditReport;
        findings?: Finding[];
        audit_logs?: AuditLog[];
    } | null>(null);

    const [loading, setLoading] = useState(true);
    const [detailLoading, setDetailLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        upload_type: "github",
        upload_url: ""
    });
    const [submitting, setSubmitting] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [editTimeRemaining, setEditTimeRemaining] = useState<number | null>(null);
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

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
        fetchContracts();
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, []);

    // Check for contract ID in URL and open it
    useEffect(() => {
        const contractIdFromUrl = searchParams.get('id');
        if (contractIdFromUrl && contracts.length > 0) {
            const contractFromUrl = contracts.find(contract => contract.id === contractIdFromUrl);
            if (contractFromUrl) {
                setSelectedContract(contractFromUrl);
                fetchContractDetails(contractFromUrl.id);
            }
        }
    }, [searchParams, contracts]);

    // Update formData when edit form is opened
    useEffect(() => {
        if (showEditForm && selectedContract) {
            setFormData({
                name: selectedContract.name,
                description: selectedContract.description,
                upload_type: selectedContract.upload_type,
                upload_url: selectedContract.upload_url
            });
        }
    }, [showEditForm, selectedContract]);

    const fetchContracts = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${backendUrl}/api/contracts`, {
                method: "GET",
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                if (response.status === 401) {
                    toast.error("Session expired. Please log in again.");
                    router.push("/");
                    return;
                }
                throw new Error(`Failed to fetch contracts: ${response.status}`);
            }

            const data = await response.json();
            setContracts(data.contracts || []);

            // Check for contract ID in URL after fetching contracts
            const contractIdFromUrl = searchParams.get('id');
            if (contractIdFromUrl) {
                const contractFromUrl = data.contracts.find(contract => contract.id === contractIdFromUrl);
                if (contractFromUrl) {
                    setSelectedContract(contractFromUrl);
                    fetchContractDetails(contractFromUrl.id);
                }
            }
        } catch (error: any) {
            console.error("Error fetching contracts:", error);
            setError(error.message || "Failed to load contracts");
            toast.error("Failed to load contracts");
        } finally {
            setLoading(false);
        }
    };

    const fetchContractDetails = async (contractId: string) => {
        try {
            setDetailLoading(true);
            setError(null);

            const response = await fetch(`${backendUrl}/api/contracts/${contractId}`, {
                method: "GET",
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                if (response.status === 401) {
                    toast.error("Session expired. Please log in again.");
                    router.push("/");
                    return;
                }
                throw new Error(`Failed to fetch contract details: ${response.status}`);
            }

            const data = await response.json();
            setContractDetails(data);

            // Check if contract can be edited (within 5 minutes of creation)
            const contract = data.contract;
            const createdAt = new Date(contract.created_at);
            const now = new Date();
            const diffInMs = now.getTime() - createdAt.getTime();
            const diffInMins = diffInMs / (1000 * 60);

            if (diffInMins < 5) {
                // Calculate remaining time in seconds
                const remainingSeconds = Math.max(0, 300 - Math.floor(diffInMs / 1000));
                setEditTimeRemaining(remainingSeconds);

                // Clear any existing interval
                if (intervalId) {
                    clearInterval(intervalId);
                }

                // Start a countdown timer
                const id = setInterval(() => {
                    setEditTimeRemaining(prev => {
                        if (prev === null || prev <= 1) {
                            clearInterval(id);
                            return null;
                        }
                        return prev - 1;
                    });
                }, 1000);

                setIntervalId(id);
            } else {
                setEditTimeRemaining(null);
                if (intervalId) {
                    clearInterval(intervalId);
                }
            }
        } catch (error: any) {
            console.error("Error fetching contract details:", error);
            setError(error.message || "Failed to load contract details");
            toast.error("Failed to load contract details");
        } finally {
            setDetailLoading(false);
        }
    };

    const handleCreateContract = async () => {
        // Use the current formData state which is set by the form component
        if (!formData.name || !formData.upload_type || !formData.upload_url) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            setSubmitting(true);

            const response = await fetch(`${backendUrl}/api/contracts`, {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to create contract");
            }

            const data = await response.json();
            toast.success("Contract created successfully");
            setShowCreateForm(false);
            setFormData({
                name: "",
                description: "",
                upload_type: "github",
                upload_url: ""
            });

            // Refresh the contracts list
            fetchContracts();

            // Show the newly created contract
            setSelectedContract(data.contract);
            fetchContractDetails(data.contract.id);

            // Update URL with the new contract ID
            router.push(`/contracts?id=${data.contract.id}`);
        } catch (error: any) {
            console.error("Error creating contract:", error);
            toast.error(error.message || "Failed to create contract");
        } finally {
            setSubmitting(false);
        }
    };

    const handleResubmitContract = async () => {
        if (!selectedContract) return;

        try {
            setSubmitting(true);

            const response = await fetch(`${backendUrl}/api/contracts/${selectedContract.id}/resubmit`, {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to resubmit contract");
            }

            const data = await response.json();
            toast.success("Contract updated successfully");
            setShowEditForm(false);

            // Refresh contract details
            setSelectedContract(data.contract);
            setContractDetails({
                ...contractDetails!,
                contract: data.contract
            });
        } catch (error: any) {
            console.error("Error resubmitting contract:", error);
            toast.error(error.message || "Failed to update contract");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteContract = async (contractId: string) => {
        if (!confirm("Are you sure you want to delete this contract?")) {
            return;
        }

        try {
            const response = await fetch(`${backendUrl}/api/contracts/${contractId}`, {
                method: "DELETE",
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to delete contract");
            }

            toast.success("Contract deleted successfully");

            // Refresh the contracts list and reset selection
            fetchContracts();
            setSelectedContract(null);
            setContractDetails(null);

            // Update URL to remove the id parameter
            router.push('/contracts');
        } catch (error: any) {
            console.error("Error deleting contract:", error);
            toast.error(error.message || "Failed to delete contract");
        }
    };

    const selectContract = (contract: Contract) => {
        setSelectedContract(contract);
        fetchContractDetails(contract.id);
        // Update URL with the contract ID
        router.push(`/contracts?id=${contract.id}`);
    };

    const clearSelectedContract = () => {
        setSelectedContract(null);
        setContractDetails(null);
        // Update URL to remove the id parameter
        router.push('/contracts');
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

    // Format remaining time for edit window
    const formatRemainingTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // Get status color class
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return "bg-green-900/30 text-green-400";
            case 'in_progress':
                return "bg-blue-900/30 text-blue-400";
            case 'pending':
                return "bg-yellow-900/30 text-yellow-400";
            case 'failed':
                return "bg-red-900/30 text-red-400";
            default:
                return "bg-zinc-900/30 text-zinc-400";
        }
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

    // Get status icon
    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return <CheckCircle size={16} className="text-green-400" />;
            case 'in_progress':
                return <Clock size={16} className="text-blue-400" />;
            case 'pending':
                return <CircleDashed size={16} className="text-yellow-400" />;
            case 'failed':
                return <AlertCircle size={16} className="text-red-400" />;
            default:
                return <CircleDashed size={16} className="text-zinc-400" />;
        }
    };

    // Get upload type icon
    const getUploadTypeIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'github':
                return <ExternalLink size={16} className="text-zinc-400" />;
            case 'program_id':
                return <Shield size={16} className="text-zinc-400" />;
            case 'google_drive':
                return <FileText size={16} className="text-zinc-400" />;
            case 'gitlab':
                return <ExternalLink size={16} className="text-zinc-400" />;
            case 'bitbucket':
                return <ExternalLink size={16} className="text-zinc-400" />;
            case 'ipfs':
                return <ExternalLink size={16} className="text-zinc-400" />;
            default:
                return <FileText size={16} className="text-zinc-400" />;
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
                onClick={fetchContracts}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors"
            >
                Retry
            </button>
        </div>
    );

    // Create/Edit Contract Form
    const ContractForm = ({ isEdit = false }: { isEdit?: boolean }) => {
        // Use local state for form inputs to prevent losing focus
        const [localFormData, setLocalFormData] = useState({
            name: formData.name,
            description: formData.description,
            upload_type: formData.upload_type,
            upload_url: formData.upload_url
        });

        // Update parent formData only when form is submitted
        const handleSubmit = () => {
            setFormData(localFormData);
            if (isEdit) {
                handleResubmitContract();
            } else {
                handleCreateContract();
            }
        };

        return (
            <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white">
                            {isEdit ? "Update Contract" : "Create New Contract"}
                        </h2>
                        <button
                            onClick={() => isEdit ? setShowEditForm(false) : setShowCreateForm(false)}
                            className="p-2 hover:bg-zinc-800 rounded-full"
                        >
                            <X size={20} className="text-zinc-400" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-zinc-400 text-sm font-medium mb-2">
                                Contract Name <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                value={localFormData.name}
                                onChange={(e) => setLocalFormData({ ...localFormData, name: e.target.value })}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="e.g., My DeFi Contract"
                            />
                        </div>

                        <div>
                            <label className="block text-zinc-400 text-sm font-medium mb-2">
                                Description
                            </label>
                            <textarea
                                value={localFormData.description}
                                onChange={(e) => setLocalFormData({ ...localFormData, description: e.target.value })}
                                rows={3}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Brief description of your contract"
                            />
                        </div>

                        <div>
                            <label className="block text-zinc-400 text-sm font-medium mb-2">
                                Upload Type <span className="text-red-400">*</span>
                            </label>
                            <select
                                value={localFormData.upload_type}
                                onChange={(e) => setLocalFormData({ ...localFormData, upload_type: e.target.value })}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            >
                                <option value="github">GitHub Repository</option>
                                <option value="program_id">Contract Address</option>
                                <option value="google_drive">Google Drive</option>
                                <option value="gitlab">GitLab Repository</option>
                                <option value="bitbucket">Bitbucket Repository</option>
                                <option value="ipfs">IPFS</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-zinc-400 text-sm font-medium mb-2">
                                URL / Contract Address <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                value={localFormData.upload_url}
                                onChange={(e) => setLocalFormData({ ...localFormData, upload_url: e.target.value })}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder={
                                    localFormData.upload_type === "github" ? "https://github.com/username/repo" :
                                        localFormData.upload_type === "program_id" ? "Enter program ID" :
                                            localFormData.upload_type === "google_drive" ? "https://drive.google.com/file/d/..." :
                                                "Enter URL"
                                }
                            />
                            <p className="mt-1 text-xs text-zinc-500">
                                {localFormData.upload_type === "github" && "Must be a valid GitHub repository URL"}
                                {localFormData.upload_type === "program_id" && "Must be 32-44 characters long"}
                                {localFormData.upload_type === "google_drive" && "Must be a valid Google Drive URL"}
                                {localFormData.upload_type === "gitlab" && "Must be a valid GitLab repository URL"}
                                {localFormData.upload_type === "bitbucket" && "Must be a valid Bitbucket repository URL"}
                                {localFormData.upload_type === "ipfs" && "Must be a valid IPFS URL (ipfs:// or https://ipfs.io/ipfs/)"}
                            </p>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 disabled:bg-zinc-600 disabled:text-zinc-400 transition-colors flex items-center space-x-2"
                            >
                                {submitting ? (
                                    <>
                                        <div className="h-4 w-4 rounded-full border-2 border-zinc-500 border-t-white animate-spin"></div>
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        {isEdit ? (
                                            <>
                                                <RefreshCw size={18} />
                                                <span>Update Contract</span>
                                            </>
                                        ) : (
                                            <>
                                                <Plus size={18} />
                                                <span>Create Contract</span>
                                            </>
                                        )}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Render the contracts list view
    const renderContractsList = () => {
        if (contracts.length === 0) {
            return (
                <div className="text-center py-12">
                    <Shield size={48} className="text-zinc-700 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Contracts Yet</h3>
                    <p className="text-zinc-400 mb-6">Upload your first contract to get started with security audits</p>
                    <button
                        onClick={() => {
                            setFormData({
                                name: "",
                                description: "",
                                upload_type: "github",
                                upload_url: ""
                            });
                            setShowCreateForm(true);
                        }}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors inline-flex items-center space-x-2"
                    >
                        <Upload size={18} />
                        <span>Upload Contract</span>
                    </button>
                </div>
            );
        }

        return (
            <div className="space-y-3">
                {contracts.map((contract) => (
                    <div
                        key={contract.id}
                        onClick={() => selectContract(contract)}
                        className={`p-4 border rounded-lg transition-all cursor-pointer hover:bg-zinc-900/50 ${selectedContract && selectedContract.id === contract.id
                            ? "border-green-500/50 bg-zinc-900/50"
                            : "border-zinc-800 bg-zinc-900/20"
                            }`}
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                    {getStatusIcon(contract.status)}
                                    <h3 className="font-medium text-white">{contract.name}</h3>
                                </div>
                                <div className="flex items-center space-x-2 text-xs text-zinc-400">
                                    <span className="flex items-center">
                                        {getUploadTypeIcon(contract.upload_type)}
                                        <span className="ml-1 capitalize">{contract.upload_type}</span>
                                    </span>
                                    <span>•</span>
                                    <span>{formatDate(contract.created_at)}</span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(contract.status)}`}>
                                    {contract.status}
                                </span>
                                <ChevronRight size={16} className="text-zinc-500" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    // Render contract details
    const renderContractDetails = () => {
        if (!selectedContract || !contractDetails) return null;

        const { contract, audit_report, findings } = contractDetails;

        return (
            <div className="space-y-6">
                {/* Header with actions */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                        <div className="flex items-center space-x-3">
                            <h2 className="text-xl font-bold text-white">{contract.name}</h2>
                            <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(contract.status)}`}>
                                {contract.status}
                            </span>
                        </div>
                        <p className="text-zinc-400 text-sm mt-1">
                            Created {formatDate(contract.created_at)}
                            {contract.updated_at !== contract.created_at && ` • Updated ${formatDate(contract.updated_at)}`}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {editTimeRemaining !== null && (
                            <div className="flex items-center space-x-2 mr-2 px-3 py-1 bg-blue-900/20 text-blue-400 rounded-lg text-sm">
                                <Clock size={14} />
                                <span>Edit time: {formatRemainingTime(editTimeRemaining)}</span>
                            </div>
                        )}

                        {editTimeRemaining !== null && (
                            <button
                                onClick={() => {
                                    setFormData({
                                        name: contract.name,
                                        description: contract.description,
                                        upload_type: contract.upload_type,
                                        upload_url: contract.upload_url
                                    });
                                    setShowEditForm(true);
                                }}
                                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors text-sm flex items-center space-x-1"
                            >
                                <RefreshCw size={14} />
                                <span>Edit</span>
                            </button>
                        )}

                        <button
                            onClick={() => handleDeleteContract(contract.id)}
                            className="px-3 py-1 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors text-sm flex items-center space-x-1"
                        >
                            <Trash2 size={14} />
                            <span>Delete</span>
                        </button>
                    </div>
                </div>

                {/* Contract details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="p-5 border border-zinc-800 rounded-lg bg-zinc-900/50">
                        <h3 className="text-lg font-medium text-white mb-4">Contract Information</h3>

                        <div className="space-y-3">
                            <div>
                                <p className="text-zinc-400 text-sm">Description</p>
                                <p className="text-white">
                                    {contract.description || "No description provided"}
                                </p>
                            </div>

                            <div className="pt-2">
                                <p className="text-zinc-400 text-sm">Description</p>
                                <p className="text-white">
                                    {contract.description || "No description provided"}
                                </p>
                            </div>

                            <div className="pt-2">
                                <p className="text-zinc-400 text-sm">Upload Type</p>
                                <div className="flex items-center mt-1">
                                    {getUploadTypeIcon(contract.upload_type)}
                                    <span className="ml-2 text-white capitalize">{contract.upload_type}</span>
                                </div>
                            </div>

                            <div className="pt-2">
                                <p className="text-zinc-400 text-sm">Source URL / Contract Address</p>
                                <a
                                    href={contract.upload_url.startsWith("http") ? contract.upload_url : "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-green-400 hover:underline break-all flex items-center mt-1"
                                >
                                    {contract.upload_url}
                                    {contract.upload_url.startsWith("http") && (
                                        <ExternalLink size={14} className="ml-1 inline-block" />
                                    )}
                                </a>
                            </div>
                        </div>
                    </div>

                    {audit_report ? (
                        <div className="p-5 border border-zinc-800 rounded-lg bg-zinc-900/50">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-medium text-white">Audit Report</h3>
                                {audit_report.report_url && (
                                    <button
                                        onClick={() => downloadReport(audit_report.id)}
                                        className="px-3 py-1 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 transition-colors text-sm flex items-center space-x-1"
                                    >
                                        <Download size={14} />
                                        <span>Download</span>
                                    </button>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-zinc-400 text-sm mb-2">Findings Overview</p>

                                    {/* Calculate severity counts from findings array */}
                                    {(() => {
                                        // Count findings by severity
                                        const severityCounts = {
                                            critical: 0,
                                            high: 0,
                                            medium: 0,
                                            low: 0,
                                            info: 0
                                        };

                                        // Calculate counts if findings exist
                                        if (findings && findings.length > 0) {
                                            findings.forEach(finding => {
                                                if (finding.severity && severityCounts.hasOwnProperty(finding.severity.toLowerCase())) {
                                                    severityCounts[finding.severity.toLowerCase()]++;
                                                }
                                            });
                                        }

                                        return (
                                            <>
                                                <div className="mb-2 bg-zinc-800/50 p-2 rounded-lg text-center">
                                                    <p className="text-xs text-zinc-400">Total Findings</p>
                                                    <p className="text-white text-xl font-bold">{audit_report.findings_count || findings?.length || 0}</p>
                                                </div>

                                                <div className="grid grid-cols-5 gap-2">
                                                    <div className="p-2 bg-red-900/20 border border-red-800/30 rounded-lg text-center">
                                                        <p className="text-xs text-zinc-400">Critical</p>
                                                        <p className="text-red-400 text-lg font-bold">{severityCounts.critical}</p>
                                                    </div>
                                                    <div className="p-2 bg-orange-900/20 border border-orange-800/30 rounded-lg text-center">
                                                        <p className="text-xs text-zinc-400">High</p>
                                                        <p className="text-orange-400 text-lg font-bold">{severityCounts.high}</p>
                                                    </div>
                                                    <div className="p-2 bg-amber-900/20 border border-amber-800/30 rounded-lg text-center">
                                                        <p className="text-xs text-zinc-400">Medium</p>
                                                        <p className="text-amber-400 text-lg font-bold">{severityCounts.medium}</p>
                                                    </div>
                                                    <div className="p-2 bg-blue-900/20 border border-blue-800/30 rounded-lg text-center">
                                                        <p className="text-xs text-zinc-400">Low</p>
                                                        <p className="text-blue-400 text-lg font-bold">{severityCounts.low}</p>
                                                    </div>
                                                    <div className="p-2 bg-green-900/20 border border-green-800/30 rounded-lg text-center">
                                                        <p className="text-xs text-zinc-400">Info</p>
                                                        <p className="text-green-400 text-lg font-bold">{severityCounts.info}</p>
                                                    </div>
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>

                                <div>
                                    <p className="text-zinc-400 text-sm">Uploaded</p>
                                    <p className="text-white">{formatDate(audit_report.uploaded_at)}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-5 border border-zinc-800 rounded-lg bg-zinc-900/50">
                            <div className="flex items-start mb-4">
                                <h3 className="text-lg font-medium text-white">Audit Status</h3>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-zinc-400 text-sm">Current Status</p>
                                    <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(contract.status)}`}>
                                        {contract.status}
                                    </span>
                                </div>

                                <div className="flex flex-col items-center py-2">
                                    <Clock size={32} className="text-zinc-600 mb-3" />
                                    <h3 className="text-lg font-medium text-white mb-1">Audit In Progress</h3>
                                    <p className="text-zinc-400 text-center">
                                        Your contract is being processed. Check the timeline below for updates.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Audit Timeline */}
                {contractDetails && contractDetails.audit_logs && contractDetails.audit_logs.length > 0 && (
                    <div className="p-5 border border-zinc-800 rounded-lg bg-zinc-900/50">
                        <h3 className="text-lg font-medium text-white mb-4">Audit Timeline</h3>

                        <div className="relative">
                            {/* Vertical line */}
                            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-zinc-700"></div>

                            {/* Timeline items */}
                            <div className="space-y-6 ml-2">
                                {contractDetails.audit_logs.map((log, index) => (
                                    <div key={log.id} className="relative pl-8">
                                        {/* Timeline dot */}
                                        <div className={`absolute left-0 top-1 h-6 w-6 rounded-full flex items-center justify-center ${index === 0 ? 'bg-green-600' : 'bg-zinc-800'
                                            }`}>
                                            {index === 0 ? (
                                                <CheckCircle size={14} className="text-white" />
                                            ) : (
                                                <div className="h-2 w-2 rounded-full bg-zinc-400"></div>
                                            )}
                                        </div>

                                        <div className="bg-zinc-800/50 p-3 rounded-lg">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                                <div>
                                                    <p className="font-medium text-white">{log.event}</p>
                                                    <p className="text-xs text-zinc-400 mt-1">
                                                        {log.actor_role === 'admin' ? 'By Auditor' : 'By User'} • {formatDate(log.created_at)}
                                                    </p>
                                                </div>
                                                {log.event.includes('Status Changed') && (
                                                    <span className={`mt-2 sm:mt-0 px-2 py-0.5 text-xs self-start rounded-full ${getStatusColor(log.event.split(' ').pop() || '')
                                                        }`}>
                                                        {log.event.split(' ').pop()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Findings */}
                {findings && findings.length > 0 && (
                    <div className="p-5 border border-zinc-800 rounded-lg bg-zinc-900/50">
                        <h3 className="text-lg font-medium text-white mb-4">Security Findings</h3>

                        <div className="space-y-4">
                            {findings.map((finding) => (
                                <div
                                    key={finding.id}
                                    className={`p-4 border rounded-lg ${getSeverityColor(finding.severity)}`}
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                                        <h4 className="font-medium text-white">{finding.title}</h4>
                                        <span className={`px-2 py-0.5 text-xs self-start rounded-full ${getSeverityColor(finding.severity)}`}>
                                            {finding.severity.toUpperCase()}
                                        </span>
                                    </div>

                                    <p className="text-zinc-300 text-sm mb-3">{finding.description}</p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <p className="text-zinc-400">Location</p>
                                            <p className="text-white font-mono text-xs bg-zinc-800/50 p-2 rounded mt-1 overflow-x-auto">
                                                {finding.location || "Not specified"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-zinc-400">Recommendation</p>
                                            <p className="text-white mt-1">
                                                {finding.recommendation || "No recommendation provided"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Go back button */}
                <button
                    onClick={clearSelectedContract}
                    className="mt-4 flex items-center text-zinc-400 hover:text-white transition-colors"
                >
                    <ChevronRight size={16} className="rotate-180 mr-1" />
                    <span>Back to contracts</span>
                </button>
            </div>
        );
    };

    // Main content renderer
    const renderContent = () => {
        return (
            <div className="flex-1 bg-black p-6 space-y-6">
                {/* Header with New Contract Button */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Contracts</h1>
                        <p className="text-zinc-400 text-sm">
                            Manage your smart contracts for security auditing
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setFormData({
                                name: "",
                                description: "",
                                upload_type: "github",
                                upload_url: ""
                            });
                            setShowCreateForm(true);
                        }}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors"
                    >
                        <Plus size={18} />
                        <span>New Contract</span>
                    </button>
                </div>

                {/* Main content area with list/detail view */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className={`md:col-span-1 ${selectedContract ? 'hidden md:block' : ''}`}>
                        <div className="p-5 border border-zinc-800 rounded-lg bg-zinc-900/50 h-full">
                            <h2 className="text-lg font-medium text-white mb-4">Your Contracts</h2>
                            {loading ? (
                                <div className="flex justify-center py-8">
                                    <div className="h-6 w-6 rounded-full border-2 border-zinc-700 border-t-green-400 animate-spin"></div>
                                </div>
                            ) : error ? (
                                <div className="text-center py-6">
                                    <AlertTriangle size={24} className="text-amber-500 mx-auto mb-2" />
                                    <p className="text-zinc-400">{error}</p>
                                    <button
                                        onClick={fetchContracts}
                                        className="mt-3 px-3 py-1 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors text-sm"
                                    >
                                        Retry
                                    </button>
                                </div>
                            ) : (
                                renderContractsList()
                            )}
                        </div>
                    </div>

                    <div className={`md:col-span-2 ${selectedContract ? '' : 'hidden md:block'}`}>
                        {selectedContract ? (
                            <div className="p-5 border border-zinc-800 rounded-lg bg-zinc-900/50">
                                {detailLoading ? (
                                    <div className="flex justify-center py-12">
                                        <div className="h-6 w-6 rounded-full border-2 border-zinc-700 border-t-green-400 animate-spin"></div>
                                    </div>
                                ) : (
                                    renderContractDetails()
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full p-12 border border-zinc-800 rounded-lg bg-zinc-900/50">
                                <Shield size={48} className="text-zinc-700 mb-4" />
                                <h3 className="text-xl font-semibold text-white mb-2">Select a Contract</h3>
                                <p className="text-zinc-400 text-center">
                                    Choose a contract from the list to view its details and audit reports
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

            {/* Show forms if needed */}
            {showCreateForm && <ContractForm />}
            {showEditForm && <ContractForm isEdit />}

            {/* Layout with dynamic sidebar */}
            <Sidebar onToggle={setSidebarCollapsed} />
            <div
                className={`min-h-screen transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}
            >
                {loading && !selectedContract ? (
                    <LoadingSpinner />
                ) : error && !selectedContract ? (
                    <ErrorDisplay message={error} />
                ) : (
                    renderContent()
                )}
            </div>
        </>
    );
}
