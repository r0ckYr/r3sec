import React, { useState } from "react";
import { Shield, ChevronRight, Upload, CreditCard, GitBranch, Globe, FileText, Clock, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { formatDate, getStatusIcon, getUploadTypeIcon, getStatusColor } from "../../utils/formatters";

const ContractsList = ({ contracts, selectedContract, onSelectContract, onCreateContract, isFormActive }) => {
    // State to track which tooltip is visible
    const [visibleTooltips, setVisibleTooltips] = useState({
        plan: null,
        payment: null,
        status: null
    });

    // Function to get contract status tooltip content
    const getStatusTooltip = (status) => {
        if (!status) return "Status unknown";

        const statusMap = {
            "pending": "Contract is being prepared for audit",
            "in_progress": "Security audit is currently in progress",
            "completed": "Security audit has been completed successfully",
            "failed": "Security audit encountered issues that need attention",
            "cancelled": "Security audit was cancelled"
        };

        return statusMap[status.toLowerCase()] || `Status: ${status}`;
    };

    // Tooltip component for hover information - now checks if form is active
    const Tooltip = ({ children, content, isVisible, position = "top" }) => {
        // Don't show tooltips when form is active
        if (isFormActive) {
            return <div className="relative">{children}</div>;
        }

        const positionClasses = {
            top: "bottom-full mb-2",
            bottom: "top-full mt-2",
            left: "right-full mr-2",
            right: "left-full ml-2"
        };

        return (
            <div className="relative group">
                <div className="relative inline-flex items-center">
                    {children}
                </div>
                {isVisible && (
                    <div className={`absolute z-40 ${positionClasses[position]} left-1/2 transform -translate-x-1/2 px-3 py-2 bg-zinc-800 text-white text-xs rounded-md shadow-lg whitespace-nowrap w-max max-w-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                        {content}
                        <div className={`absolute ${position === "top" ? "top-full" : "bottom-full"} left-1/2 transform -translate-x-1/2 border-8 ${position === "top" ? "border-t-zinc-800" : "border-b-zinc-800"} border-x-transparent border-b-transparent`}></div>
                    </div>
                )}
            </div>
        );
    };

    // Function to determine plan display
    const getPlanInfo = (planId) => {
        // Check for null, undefined, empty string, or blank spaces
        if (!planId || planId.trim() === '') {
            return {
                text: "No Plan",
                className: "bg-zinc-800 text-zinc-400",
                tooltip: "No subscription plan has been selected"
            };
        }

        const plan = planId.trim().toLowerCase();

        switch (plan) {
            case "standard":
                return {
                    text: "Standard",
                    className: "bg-blue-900/30 text-blue-400",
                    tooltip: "Standard Plan: Basic security auditing with automated vulnerability scanning"
                };
            case "advanced":
                return {
                    text: "Advanced",
                    className: "bg-purple-900/30 text-purple-400",
                    tooltip: "Advanced Plan: Comprehensive auditing with manual review and remediation assistance"
                };
            case "enterprise":
                return {
                    text: "Enterprise",
                    className: "bg-indigo-900/30 text-indigo-400",
                    tooltip: "Enterprise Plan: Full-scale security assessment with dedicated security team and continuous monitoring"
                };
            default:
                return {
                    text: plan.charAt(0).toUpperCase() + plan.slice(1),
                    className: "bg-zinc-800 text-zinc-400",
                    tooltip: `Custom plan: ${plan.charAt(0).toUpperCase() + plan.slice(1)}`
                };
        }
    };

    // Function to determine payment status display
    const getPaymentStatusInfo = (status) => {
        // Check for null, undefined, empty string, or blank spaces
        if (!status || status.trim() === '') {
            return {
                icon: <AlertTriangle size={14} className="text-zinc-400" />,
                text: "Unknown",
                className: "bg-zinc-800 text-zinc-400",
                tooltip: "Payment status information is unavailable"
            };
        }

        const paymentStatus = status.trim().toLowerCase();

        switch (paymentStatus) {
            case "verified":
                return {
                    icon: <CheckCircle size={14} className="text-emerald-400" />,
                    text: "Verified",
                    className: "bg-emerald-900/30 text-emerald-400",
                    tooltip: "Payment verified and confirmed - services are active"
                };
            case "failed":
                return {
                    icon: <AlertTriangle size={14} className="text-red-400" />,
                    text: "Failed",
                    className: "bg-red-900/30 text-red-400",
                    tooltip: "Payment failed - please check your payment method"
                };
            case "pending":
                return {
                    icon: <Clock size={14} className="text-amber-400" />,
                    text: "Pending",
                    className: "bg-amber-900/30 text-amber-400",
                    tooltip: "Payment is being processed - this may take a few minutes"
                };
            default:
                return {
                    icon: <AlertTriangle size={14} className="text-zinc-400" />,
                    text: status.charAt(0).toUpperCase() + status.slice(1),
                    className: "bg-zinc-800 text-zinc-400",
                    tooltip: `Payment status: ${status}`
                };
        }
    };

    // We're not using the combined badge function anymore as we're
    // rendering the badges directly in the component

    if (contracts.length === 0) {
        return (
            <div className="text-center py-12">
                <Shield size={48} className="text-zinc-700 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Contracts Yet</h3>
                <p className="text-zinc-400 mb-6">Upload your first contract to get started with security audits</p>
                <button
                    onClick={onCreateContract}
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
            {contracts.map((contract) => {
                return (
                    <div
                        key={contract.id}
                        onClick={() => onSelectContract(contract)}
                        className={`p-4 border rounded-lg transition-all cursor-pointer hover:bg-zinc-900/50 ${selectedContract && selectedContract.id === contract.id
                            ? "border-green-500/50 bg-zinc-900/50"
                            : "border-zinc-800 bg-zinc-900/20"
                            }`}
                    >
                        <div className="flex flex-row">
                            {/* Left side: Contract details */}
                            <div className="flex-grow space-y-1">
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

                            {/* Right side: Status badges stacked vertically */}
                            <div className="ml-4 flex flex-col space-y-2 justify-center min-w-24 w-auto">
                                {/* Plan badge with payment icon */}
                                <div className="flex items-center space-x-1">
                                    {contract.payment_id && contract.payment_id.trim() !== '' && (
                                        <Tooltip
                                            content={getPlanInfo(contract.plan_id).tooltip}
                                            isVisible={true}
                                            position="left"
                                            isFormActive={isFormActive}
                                        >
                                            <div
                                                className={`px-3 py-1 text-xs rounded-full flex items-center justify-center cursor-help ${getPlanInfo(contract.plan_id).className}`}
                                                onMouseEnter={() => !isFormActive && setVisibleTooltips(prev => ({ ...prev, plan: contract.id }))}
                                                onMouseLeave={() => !isFormActive && setVisibleTooltips(prev => ({ ...prev, plan: null }))}
                                            >
                                                <span>{getPlanInfo(contract.plan_id).text}</span>
                                            </div>
                                        </Tooltip>
                                    )}

                                    {/* Payment icon (no text) */}
                                    {contract.payment_id && contract.payment_id.trim() !== '' ? (
                                        <Tooltip
                                            content={getPaymentStatusInfo(contract.payment_status).tooltip}
                                            isVisible={true}
                                            position="left"
                                            isFormActive={isFormActive}
                                        >
                                            <div
                                                className={`w-6 h-6 rounded-full flex items-center justify-center cursor-help ${getPaymentStatusInfo(contract.payment_status).className}`}
                                                onMouseEnter={() => !isFormActive && setVisibleTooltips(prev => ({ ...prev, payment: contract.id }))}
                                                onMouseLeave={() => !isFormActive && setVisibleTooltips(prev => ({ ...prev, payment: null }))}
                                            >
                                                {getPaymentStatusInfo(contract.payment_status).icon}
                                            </div>
                                        </Tooltip>
                                    ) : (
                                        <Tooltip
                                            content="No payment method has been set up for this contract"
                                            isVisible={true}
                                            position="left"
                                            isFormActive={isFormActive}
                                        >
                                            <div
                                                className="w-6 h-6 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center cursor-help"
                                                onMouseEnter={() => !isFormActive && setVisibleTooltips(prev => ({ ...prev, payment: contract.id }))}
                                                onMouseLeave={() => !isFormActive && setVisibleTooltips(prev => ({ ...prev, payment: null }))}
                                            >
                                                <CreditCard size={12} />
                                            </div>
                                        </Tooltip>
                                    )}
                                </div>

                                {/* No Payment badge when there's no plan */}
                                {(!contract.payment_id || contract.payment_id.trim() === '') && (
                                    <Tooltip
                                        content="No payment method has been set up for this contract"
                                        isVisible={true}
                                        position="left"
                                        isFormActive={isFormActive}
                                    >
                                        <div
                                            className="px-3 py-1 text-xs rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center cursor-help"
                                            onMouseEnter={() => !isFormActive && setVisibleTooltips(prev => ({ ...prev, payment: contract.id }))}
                                            onMouseLeave={() => !isFormActive && setVisibleTooltips(prev => ({ ...prev, payment: null }))}
                                        >
                                            <CreditCard size={12} className="mr-1" />
                                        </div>
                                    </Tooltip>
                                )}

                                {/* Contract status badge */}
                                <Tooltip
                                    content={getStatusTooltip(contract.status)}
                                    isVisible={true}
                                    position="left"
                                    isFormActive={isFormActive}
                                >
                                    <div className="flex items-center">
                                        <span
                                            className={`px-3 py-1 text-xs rounded-full cursor-help flex items-center justify-center ${getStatusColor(contract.status)}`}
                                            onMouseEnter={() => !isFormActive && setVisibleTooltips(prev => ({ ...prev, status: contract.id }))}
                                            onMouseLeave={() => !isFormActive && setVisibleTooltips(prev => ({ ...prev, status: null }))}
                                        >
                                            {contract.status}
                                            <Info size={10} className="ml-1 opacity-70" />
                                        </span>
                                        <ChevronRight size={16} className="text-zinc-500 ml-1" />
                                    </div>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ContractsList;
