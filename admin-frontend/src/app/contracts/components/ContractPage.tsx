"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

// Components
import AdminSidebar from "../../components/Sidebar";
import ContractsTable from "../components/ContractsTable";
import ContractDetails from "../components/ContractsDetails";
import StatusUpdateModal from "../components/StatusUpdateModal";
import ReportSubmissionModal from "../components/ReportSubmissionModal";
import FindingsSubmissionModal from "../components/FindingsSubmissionModal";
import { LoadingSpinner, ErrorDisplay } from "../../components/UIComponents";
import FilterControls from "../../components/FilterControls";

// Types
import {
    Contract,
    ContractWithUser,
    User,
    AuditLog,
    Finding,
    Pagination
} from "@/types/adminTypes";

export default function AdminContracts() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [contracts, setContracts] = useState<ContractWithUser[]>([]);
    const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
    const [contractDetails, setContractDetails] = useState<{
        contract: Contract;
        user?: User;
        audit_logs?: AuditLog[];
    } | null>(null);

    const [loading, setLoading] = useState(true);
    const [detailLoading, setDetailLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // State for status update
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const [showStatusForm, setShowStatusForm] = useState(false);
    const [newStatus, setNewStatus] = useState("");

    // State for report submission
    const [showReportForm, setShowReportForm] = useState(false);
    const [reportData, setReportData] = useState({
        contract_id: "",
        report_url: "",
        summary: "",
        severity_summary: "",
        findings_count: 0
    });
    const [isSubmittingReport, setIsSubmittingReport] = useState(false);

    // State for findings submission
    const [showFindingsForm, setShowFindingsForm] = useState(false);
    const [findings, setFindings] = useState<Finding[]>([]);
    const [currentFinding, setCurrentFinding] = useState<Finding>({
        title: "",
        severity: "medium",
        description: "",
        recommendation: "",
        location: ""
    });
    const [isSubmittingFindings, setIsSubmittingFindings] = useState(false);

    // Filtering and sorting
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
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
            router.push("/admin/login");
            return;
        }

        fetchContracts();
    }, [pagination.page, statusFilter, sortBy, sortOrder, searchTerm]);

    // Check for contract ID in URL and open it
    useEffect(() => {
        const contractIdFromUrl = searchParams.get('id');
        if (contractIdFromUrl && contracts.length > 0) {
            const contractFromUrl = contracts.find(item => item.contract.id === contractIdFromUrl);
            if (contractFromUrl) {
                setSelectedContract(contractFromUrl.contract);
                fetchContractDetails(contractFromUrl.contract.id);
            }
        }
    }, [searchParams, contracts]);

    const fetchContracts = async () => {
        try {
            setLoading(true);
            setError(null);

            let url = `${backendUrl}/api/admin/contracts?page=${pagination.page}&limit=${pagination.limit}`;

            if (statusFilter !== "all") {
                url += `&status=${statusFilter}`;
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
                    router.push("/admin/login");
                    return;
                }
                throw new Error(`Failed to fetch contracts: ${response.status}`);
            }

            const data = await response.json();
            setContracts(data.contracts || []);
            setPagination(data.pagination || {
                limit: 20,
                page: 1,
                pages: 1,
                total: 0
            });

            // Check for contract ID in URL after fetching contracts
            const contractIdFromUrl = searchParams.get('id');
            if (contractIdFromUrl) {
                const contractFromUrl = data.contracts.find(item => item.contract.id === contractIdFromUrl);
                if (contractFromUrl) {
                    setSelectedContract(contractFromUrl.contract);
                    fetchContractDetails(contractFromUrl.contract.id);
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

            const response = await fetch(`${backendUrl}/api/admin/contracts/${contractId}`, {
                method: "GET",
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                if (response.status === 401) {
                    toast.error("Session expired. Please log in again.");
                    router.push("/admin/login");
                    return;
                }
                throw new Error(`Failed to fetch contract details: ${response.status}`);
            }

            const data = await response.json();
            setContractDetails(data);

            // Initialize report data with contract ID
            setReportData({
                ...reportData,
                contract_id: contractId
            });

        } catch (error: any) {
            console.error("Error fetching contract details:", error);
            setError(error.message || "Failed to load contract details");
            toast.error("Failed to load contract details");
        } finally {
            setDetailLoading(false);
        }
    };

    const updateContractStatus = async () => {
        if (!selectedContract || !newStatus) return;

        try {
            setIsUpdatingStatus(true);

            const response = await fetch(`${backendUrl}/api/admin/contracts/${selectedContract.id}/status`, {
                method: "PUT",
                headers: getAuthHeaders(),
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to update contract status");
            }

            const data = await response.json();
            toast.success(`Status updated to ${newStatus} successfully`);

            // Update local state
            setSelectedContract({
                ...selectedContract,
                status: newStatus
            });

            if (contractDetails) {
                setContractDetails({
                    ...contractDetails,
                    contract: {
                        ...contractDetails.contract,
                        status: newStatus
                    }
                });
            }

            // Refresh contracts list
            fetchContracts();
            setShowStatusForm(false);

        } catch (error: any) {
            console.error("Error updating contract status:", error);
            toast.error(error.message || "Failed to update status");
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    const submitAuditReport = async () => {
        if (!reportData.report_url || !reportData.summary) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            setIsSubmittingReport(true);

            const response = await fetch(`${backendUrl}/api/admin/reports`, {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify(reportData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to submit audit report");
            }

            const data = await response.json();
            toast.success("Audit report submitted successfully");

            // Update UI
            if (selectedContract) {
                // Update contract status to completed if not already
                if (selectedContract.status !== "completed") {
                    updateContractStatusSilently(selectedContract.id, "completed");
                }

                // Refresh contract details
                fetchContractDetails(selectedContract.id);
            }

            setShowReportForm(false);

            // Show findings form
            setShowFindingsForm(true);

        } catch (error: any) {
            console.error("Error submitting audit report:", error);
            toast.error(error.message || "Failed to submit report");
        } finally {
            setIsSubmittingReport(false);
        }
    };

    const updateContractStatusSilently = async (contractId: string, status: string) => {
        try {
            await fetch(`${backendUrl}/api/admin/contracts/${contractId}/status`, {
                method: "PUT",
                headers: getAuthHeaders(),
                body: JSON.stringify({ status })
            });

            // Update local state without notification
            if (selectedContract && selectedContract.id === contractId) {
                setSelectedContract({
                    ...selectedContract,
                    status
                });

                if (contractDetails) {
                    setContractDetails({
                        ...contractDetails,
                        contract: {
                            ...contractDetails.contract,
                            status
                        }
                    });
                }
            }

            // Refresh contracts list
            fetchContracts();

        } catch (error) {
            console.error("Error silently updating contract status:", error);
        }
    };

    const addFinding = () => {
        if (!currentFinding.title || !currentFinding.description || !currentFinding.recommendation) {
            toast.error("Please fill in all required fields");
            return;
        }

        setFindings([...findings, currentFinding]);
        setCurrentFinding({
            title: "",
            severity: "medium",
            description: "",
            recommendation: "",
            location: ""
        });

        toast.success("Finding added to list");
    };

    const removeFinding = (index: number) => {
        const updatedFindings = [...findings];
        updatedFindings.splice(index, 1);
        setFindings(updatedFindings);
    };

    const submitFindings = async () => {
        if (!selectedContract || findings.length === 0) {
            toast.error("No findings to submit");
            return;
        }

        try {
            setIsSubmittingFindings(true);

            const response = await fetch(`${backendUrl}/api/admin/reports/${selectedContract.id}/findings`, {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify(findings)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to submit findings");
            }

            const data = await response.json();
            toast.success(`${data.count} findings submitted successfully`);

            // Clear findings
            setFindings([]);
            setShowFindingsForm(false);

            // Refresh contract details
            if (selectedContract) {
                fetchContractDetails(selectedContract.id);
            }

        } catch (error: any) {
            console.error("Error submitting findings:", error);
            toast.error(error.message || "Failed to submit findings");
        } finally {
            setIsSubmittingFindings(false);
        }
    };

    const handleContractSelect = (contract: Contract) => {
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

    // Main content renderer
    const renderContent = () => {
        return (
            <div className="flex-1 bg-black p-6 space-y-6">
                {/* Header with filters */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Contract Management</h1>
                        <p className="text-zinc-400 text-sm">
                            Review and manage user submitted contracts
                        </p>
                    </div>

                    <FilterControls
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        setSortBy={setSortBy}
                        setSortOrder={setSortOrder}
                    />
                </div>

                {/* Main content area with list/detail view */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden">
                    {selectedContract ? (
                        <div className="p-6">
                            {detailLoading ? (
                                <LoadingSpinner />
                            ) : (
                                <ContractDetails
                                    contractDetails={contractDetails}
                                    onStatusUpdate={() => {
                                        setNewStatus(selectedContract.status);
                                        setShowStatusForm(true);
                                    }}
                                    onReportSubmit={() => {
                                        setReportData({
                                            contract_id: selectedContract.id,
                                            report_url: "",
                                            summary: "",
                                            severity_summary: "",
                                            findings_count: 0
                                        });
                                        setShowReportForm(true);
                                    }}
                                    onBack={clearSelectedContract}
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
                                    onRetry={fetchContracts}
                                />
                            ) : (
                                <div>
                                    <ContractsTable
                                        contracts={contracts}
                                        selectedContract={selectedContract}
                                        onContractSelect={handleContractSelect}
                                    />
                                    <div className="p-4 border-t border-zinc-800">
                                        {pagination.pages > 1 && (
                                            <div className="flex items-center justify-between mt-4 text-sm">
                                                <p className="text-zinc-400">
                                                    Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} contracts
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

            {/* Show modals if needed */}
            <AnimatePresence>
                {showStatusForm && (
                    <StatusUpdateModal
                        selectedContract={selectedContract}
                        newStatus={newStatus}
                        setNewStatus={setNewStatus}
                        isUpdatingStatus={isUpdatingStatus}
                        onClose={() => setShowStatusForm(false)}
                        onUpdate={updateContractStatus}
                    />
                )}
                {showReportForm && (
                    <ReportSubmissionModal
                        selectedContract={selectedContract}
                        reportData={reportData}
                        setReportData={setReportData}
                        isSubmittingReport={isSubmittingReport}
                        onClose={() => setShowReportForm(false)}
                        onSubmit={submitAuditReport}
                    />
                )}
                {showFindingsForm && (
                    <FindingsSubmissionModal
                        findings={findings}
                        currentFinding={currentFinding}
                        setCurrentFinding={setCurrentFinding}
                        isSubmittingFindings={isSubmittingFindings}
                        onClose={() => setShowFindingsForm(false)}
                        onAddFinding={addFinding}
                        onRemoveFinding={removeFinding}
                        onSubmitFindings={submitFindings}
                    />
                )}
            </AnimatePresence>

            {/* Layout with sidebar */}
            <AdminSidebar onToggle={setIsSidebarOpen} />
            <div
                className={`min-h-screen transition-all duration-300 ${isSidebarOpen ? 'ml-20' : 'ml-64'}`}
            >
                {loading && !selectedContract && !contracts.length ? (
                    <LoadingSpinner />
                ) : error && !selectedContract && !contracts.length ? (
                    <ErrorDisplay message={error} onRetry={fetchContracts} />
                ) : (
                    renderContent()
                )}
            </div>
        </>
    );
}
