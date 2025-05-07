import React, { useState, useEffect } from "react";
import {
    RefreshCw,
    Trash2,
    ExternalLink,
    ChevronRight,
    Clock,
    Download,
    CheckCircle,
    CircleDashed,
    AlertCircle,
    CreditCard
} from "lucide-react";

// Utility imports
import {
    formatDate,
    getStatusColor,
    getSeverityColor,
    getStatusIcon,
    getUploadTypeIcon
} from "../../utils/formatters";

// Sub-components
import FindingsList from "./FindingsList";
import AuditTimeline from "./AuditTimeline";
import AuditReport from "./AuditReport";

const ContractDetails = ({
    contract,
    contractDetails,
    editTimeRemaining,
    onEdit,
    onDelete,
    onBackToList,
    onDownloadReport
}) => {
    const [paymentDetails, setPaymentDetails] = useState(null);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [paymentError, setPaymentError] = useState(null);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

    // Function to get auth headers using the correct token name
    const getAuthHeaders = () => {
        const authToken = localStorage.getItem("authToken");
        return {
            "Authorization": `Bearer ${authToken}`,
            "Content-Type": "application/json"
        };
    };

    useEffect(() => {
        const fetchPaymentDetails = async () => {
            // Only fetch if contract exists and has a payment_id
            if (!contract || !contract.payment_id) return;

            try {
                setPaymentLoading(true);
                setPaymentError(null);

                const response = await fetch(`${backendUrl}/api/payments/${contract.payment_id}`, {
                    method: "GET",
                    headers: getAuthHeaders()
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch payment details: ${response.status}`);
                }

                const data = await response.json();
                setPaymentDetails(data.payment);
            } catch (error) {
                console.error("Error fetching payment details:", error);
                setPaymentError(error.message || "Failed to load payment details");
            } finally {
                setPaymentLoading(false);
            }
        };

        fetchPaymentDetails();
    }, [contract, backendUrl]);

    if (!contract || !contractDetails) return null;

    const { audit_report, findings, audit_logs } = contractDetails;

    // Internal time formatter function that offers a more realistic display
    const formatTime = (seconds) => {
        // For durations under 1 minute
        if (seconds < 60) {
            return `${seconds} seconds`;
        }

        // For durations between 1 minute and 1 hour
        if (seconds < 3600) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;

            // If it's exactly on the minute
            if (remainingSeconds === 0) {
                return minutes === 1 ? "1 minute" : `${minutes} minutes`;
            }

            // Show minutes and seconds
            return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
        }

        // For durations over 1 hour
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);

        // If it's exactly on the hour
        if (minutes === 0) {
            return hours === 1 ? "1 hour" : `${hours} hours`;
        }

        // Show hours and minutes
        return `${hours}:${minutes.toString().padStart(2, "0")}`;
    };

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
                            <span>Edit time: {formatTime(editTimeRemaining)}</span>
                        </div>
                    )}

                    {editTimeRemaining !== null && (
                        <button
                            onClick={onEdit}
                            className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors text-sm flex items-center space-x-1"
                        >
                            <RefreshCw size={14} />
                            <span>Edit</span>
                        </button>
                    )}

                    <button
                        onClick={() => onDelete(contract.id)}
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
                            {contract.upload_url.startsWith("http") ? (
                                <a
                                    href={contract.upload_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-green-400 hover:underline break-all flex items-center mt-1"
                                >
                                    {contract.upload_url}
                                    <ExternalLink size={14} className="ml-1 inline-block" />
                                </a>
                            ) : (
                                <p className="text-white mt-1">{contract.upload_url || "N/A"}</p>
                            )}
                        </div>


                        <div className="pt-2">
                            <p className="text-zinc-400 text-sm">Plan</p>
                            <p className="text-white capitalize">{contract.plan_id || "No plan selected"}</p>
                        </div>
                    </div>
                </div>

                {audit_report ? (
                    <AuditReport
                        auditReport={audit_report}
                        findings={findings}
                        onDownload={() => onDownloadReport(audit_report.id)}
                    />
                ) : (
                    <AuditStatus contract={contract} />
                )}
            </div>

            {/* Audit Timeline */}
            {
                audit_logs && audit_logs.length > 0 && (
                    <AuditTimeline auditLogs={audit_logs} />
                )
            }

            {/* Payment Information - placed below timeline */}
            {
                contract.payment_id && (
                    <div className="mt-6">
                        <PaymentInfo
                            payment={paymentDetails}
                            loading={paymentLoading}
                            error={paymentError}
                        />
                    </div>
                )
            }

            {/* Findings */}
            {
                findings && findings.length > 0 && (
                    <FindingsList findings={findings} />
                )
            }

            {/* Go back button */}
            <button
                onClick={onBackToList}
                className="mt-4 flex items-center text-zinc-400 hover:text-white transition-colors"
            >
                <ChevronRight size={16} className="rotate-180 mr-1" />
                <span>Back to contracts</span>
            </button>
        </div >
    );
};

// Payment Information Component
const PaymentInfo = ({ payment, loading, error }) => {
    if (loading) {
        return (
            <div className="p-5 border border-zinc-800 rounded-lg bg-zinc-900/50">
                <div className="flex items-center mb-4">
                    <CreditCard size={20} className="text-zinc-400 mr-2" />
                    <h3 className="text-lg font-medium text-white">Payment Information</h3>
                </div>
                <div className="flex justify-center items-center h-32">
                    <CircleDashed size={24} className="animate-spin text-green-400" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-5 border border-zinc-800 rounded-lg bg-zinc-900/50">
                <div className="flex items-center mb-4">
                    <CreditCard size={20} className="text-zinc-400 mr-2" />
                    <h3 className="text-lg font-medium text-white">Payment Information</h3>
                </div>
                <div className="flex flex-col items-center py-2 text-center">
                    <AlertCircle size={24} className="text-red-500 mb-2" />
                    <p className="text-red-400">Error loading payment details</p>
                </div>
            </div>
        );
    }

    if (!payment) {
        return (
            <div className="p-5 border border-zinc-800 rounded-lg bg-zinc-900/50">
                <div className="flex items-center mb-4">
                    <CreditCard size={20} className="text-zinc-400 mr-2" />
                    <h3 className="text-lg font-medium text-white">Payment Information</h3>
                </div>
                <div className="flex flex-col items-center py-2 text-center">
                    <AlertCircle size={24} className="text-yellow-500 mb-2" />
                    <p className="text-zinc-400">Payment information not available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-5 border border-zinc-800 rounded-lg bg-zinc-900/50">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <CreditCard size={20} className="text-zinc-400 mr-2" />
                    <h3 className="text-lg font-medium text-white">Payment Information</h3>
                </div>
                <span className={`px-2 py-0.5 text-xs rounded-full ${payment.status === 'verified'
                    ? 'bg-green-900/30 text-green-400'
                    : payment.status === 'pending'
                        ? 'bg-yellow-900/30 text-yellow-400'
                        : 'bg-red-900/30 text-red-400'
                    }`}>
                    {payment.status}
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                    <div>
                        <p className="text-zinc-400 text-sm">Plan</p>
                        <p className="text-white capitalize">{payment.plan_id}</p>
                    </div>

                    <div>
                        <p className="text-zinc-400 text-sm">Amount</p>
                        <div className="flex space-x-4">
                            <p className="text-white">${payment.amount_usd} USD</p>
                            <p className="text-green-400">{payment.amount_sol} SOL</p>
                        </div>
                        <p className="text-zinc-500 text-xs mt-1">
                            SOL Price: ${payment.sol_price_at_payment.toFixed(2)} USD
                        </p>
                    </div>

                    <div>
                        <p className="text-zinc-400 text-sm">Network</p>
                        <p className="text-white capitalize">{payment.network}</p>
                    </div>

                    <div>
                        <p className="text-zinc-400 text-sm">Payment Date</p>
                        <p className="text-white">{formatDate(payment.created_at)}</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <div>
                        <p className="text-zinc-400 text-sm">Transaction Details</p>
                        <div className="space-y-2 mt-1">
                            <div>
                                <span className="text-zinc-500 text-xs">Wallet Address</span>
                                <span className="text-white text-sm break-all block">
                                    {payment.wallet_address}
                                </span>
                            </div>
                            <div>
                                <span className="text-zinc-500 text-xs">Signature</span>
                                <span className="text-white text-sm break-all block">
                                    {payment.signature.substring(0, 16)}...{payment.signature.substring(payment.signature.length - 16)}
                                </span>
                                <a
                                    href={`https://${payment.network === 'mainnet' ? '' : payment.network + '.'}solscan.io/tx/${payment.signature}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-green-400 hover:underline text-xs flex items-center mt-1"
                                >
                                    View on Solscan <ExternalLink size={12} className="ml-1 inline-block" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Status display when no audit report is available
const AuditStatus = ({ contract }) => (
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
);

export default ContractDetails;
