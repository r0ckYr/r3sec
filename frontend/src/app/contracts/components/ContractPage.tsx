"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import { Shield } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import {
    Plus,
} from "lucide-react";

// Component imports
import ContractsList from "./ContractsList";
import ContractDetails from "./ContractDetails";
import ContractForm from "./ContractForm";
import { LoadingSpinner, ErrorDisplay } from "./UIComponents";
import SolanaPayment from "./SolanaPayment";
import PricingPlans from "./PricingPlans";

export default function Contracts() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [contracts, setContracts] = useState([]);
    const [selectedContract, setSelectedContract] = useState(null);
    const [contractDetails, setContractDetails] = useState(null);

    const [showPricingPlans, setShowPricingPlans] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [showPayment, setShowPayment] = useState(false);
    const [paymentCompleted, setPaymentCompleted] = useState(false);
    const [paymentDetails, setPaymentDetails] = useState(null);

    const [loading, setLoading] = useState(true);
    const [detailLoading, setDetailLoading] = useState(false);
    const [error, setError] = useState(null);
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
    const [editTimeRemaining, setEditTimeRemaining] = useState(null);
    const [intervalId, setIntervalId] = useState(null);

    const intervalIdRef = useRef(null);

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
        } catch (error) {
            console.error("Error fetching contracts:", error);
            setError(error.message || "Failed to load contracts");
            toast.error("Failed to load contracts");
        } finally {
            setLoading(false);
        }
    };

    const fetchContractDetails = async (contractId) => {
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
                if (intervalIdRef.current) {
                    clearInterval(intervalIdRef.current);
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

                intervalIdRef.current = id;
            } else {
                setEditTimeRemaining(null);
                if (intervalIdRef.current) {
                    clearInterval(intervalIdRef.current);
                    intervalIdRef.current = null;
                }
            }
        } catch (error) {
            console.error("Error fetching contract details:", error);
            setError(error.message || "Failed to load contract details");
            toast.error("Failed to load contract details");
        } finally {
            setDetailLoading(false);
        }
    };


    // Handle plan selection
    const handleSelectPlan = (plan) => {
        setSelectedPlan(plan);
        setShowPricingPlans(false);
        setShowPayment(true);
    };

    const handlePaymentSuccess = (paymentData) => {
        setPaymentCompleted(true);
        setShowPayment(false);
        console.log("payment id : ", paymentData.payment_id);


        // Store payment details including the payment_id
        setPaymentDetails({
            payment_id: paymentData.payment_id || "" // Include payment_id from SolanaPayment
        });

        // Now show the contract form
        setShowCreateForm(true);
    };

    // Handle creating contract with payment info
    const handleCreateContractWithPayment = async () => {
        // Use the current formData state which is set by the form component
        if (!formData.name || !formData.upload_type || !formData.upload_url) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            setSubmitting(true);

            // Include payment_id in contract creation request
            const requestData = {
                ...formData,
                payment_id: paymentDetails.payment_id // Add payment_id to the request
            };

            const response = await fetch(`${backendUrl}/api/contracts`, {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify(requestData)
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

            // Reset payment state
            setPaymentCompleted(false);
            setPaymentDetails(null);
            setSelectedPlan(null);

            // Refresh the contracts list
            fetchContracts();

            // Show the newly created contract
            setSelectedContract(data.contract);
            fetchContractDetails(data.contract.id);

            // Update URL with the new contract ID
            router.push(`/contracts?id=${data.contract.id}`);
        } catch (error) {
            console.error("Error creating contract:", error);
            toast.error(error.message || "Failed to create contract");
        } finally {
            setSubmitting(false);
        }
    };

    // Modify the new contract button click handler
    const handleNewContractClick = () => {
        setFormData({
            name: "",
            description: "",
            upload_type: "github",
            upload_url: ""
        });
        setShowPricingPlans(true);
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
        } catch (error) {
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
                ...contractDetails,
                contract: data.contract
            });
        } catch (error) {
            console.error("Error resubmitting contract:", error);
            toast.error(error.message || "Failed to update contract");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteContract = async (contractId) => {
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
        } catch (error) {
            console.error("Error deleting contract:", error);
            toast.error(error.message || "Failed to delete contract");
        }
    };

    const selectContract = (contract) => {
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

    const downloadReport = async (reportId) => {
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
        } catch (error) {
            console.error("Error downloading report:", error);
            toast.error(error.message || "Failed to download report");
        }
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
                        onClick={handleNewContractClick}
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
                                    <ErrorDisplay message={error} onRetry={fetchContracts} />
                                </div>
                            ) : (
                                <ContractsList
                                    contracts={contracts}
                                    selectedContract={selectedContract}
                                    isFormActive={showEditForm || showPayment || showCreateForm || showPricingPlans}
                                    onSelectContract={selectContract}
                                    onCreateContract={() => {
                                        setFormData({
                                            name: "",
                                            description: "",
                                            upload_type: "github",
                                            upload_url: ""
                                        });
                                        setShowCreateForm(true);
                                    }}
                                />
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
                                    <ContractDetails
                                        contract={selectedContract}
                                        contractDetails={contractDetails}
                                        editTimeRemaining={editTimeRemaining}
                                        onEdit={() => {
                                            setFormData({
                                                name: selectedContract.name,
                                                description: selectedContract.description,
                                                upload_type: selectedContract.upload_type,
                                                upload_url: selectedContract.upload_url
                                            });
                                            setShowEditForm(true);
                                        }}
                                        onDelete={handleDeleteContract}
                                        onBackToList={clearSelectedContract}
                                        onDownloadReport={downloadReport}
                                    />
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full p-12 border border-zinc-800 rounded-lg bg-zinc-900/50">
                                <NoContractSelected />
                            </div>
                        )}
                    </div>
                </div>
            </div >
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

            {/* Show Pricing Plans */}
            {showPricingPlans && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <PricingPlans onSelectPlan={handleSelectPlan} />
                        <div className="p-4 border-t border-zinc-800 flex justify-end">
                            <button
                                onClick={() => setShowPricingPlans(false)}
                                className="px-4 py-2 text-zinc-400 hover:bg-zinc-800 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Show Payment UI */}
            {showPayment && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <SolanaPayment
                            plan={selectedPlan}
                            onPaymentSuccess={handlePaymentSuccess}
                            onBack={() => {
                                setShowPayment(false);
                                setShowPricingPlans(true);
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Show Contract Form after payment */}
            {showCreateForm && (
                <ContractForm
                    isEdit={false}
                    formData={formData}
                    setFormData={setFormData}
                    onSubmit={handleCreateContractWithPayment}
                    submitting={submitting}
                    onClose={() => {
                        setShowCreateForm(false);
                        setPaymentCompleted(false);
                        setPaymentDetails(null);
                    }}
                />
            )}

            {showEditForm && (
                <ContractForm
                    isEdit={true}
                    formData={formData}
                    setFormData={setFormData}
                    onSubmit={handleResubmitContract}
                    submitting={submitting}
                    onClose={() => setShowEditForm(false)}
                />
            )}

            {/* Layout with dynamic sidebar */}
            <Sidebar onToggle={setSidebarCollapsed} />
            <div
                className={`min-h-screen transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}
            >
                {loading && !selectedContract ? (
                    <LoadingSpinner />
                ) : error && !selectedContract ? (
                    <ErrorDisplay message={error} onRetry={fetchContracts} />
                ) : (
                    renderContent()
                )}
            </div>
        </>
    );
}

const NoContractSelected = () => (
    <>
        <Shield size={48} className="text-zinc-700 mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Select a Contract</h3>
        <p className="text-zinc-400 text-center">
            Choose a contract from the list to view its details and audit reports
        </p>
    </>
);
