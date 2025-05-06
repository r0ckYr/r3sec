"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import AdminSidebar from "../../components/Sidebar";
import ScrollableMessageArea from "../../components/ScorllableMessageArea";

import {
    Shield,
    AlertTriangle,
    Clock,
    Send,
    ChevronRight,
    FileText,
    MessageSquare,
    ChevronLeft,
    FileSearch,
    Bell,
    Mail,
    User,
    Trash2,
    ChevronDown,
    ChevronUp
} from "lucide-react";

// Types
interface Message {
    id: string;
    contract_id: string;
    sender_id: string;
    sender_role: string;
    content: string;
    is_read: boolean;
    created_at: string;
}

interface Contract {
    id: string;
    name: string;
    user_id: string;
    description: string;
    upload_type: string;
    upload_url: string;
    status: string;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
}

interface ContractWithUnread {
    contract_id: string;
    contract_name: string;
    has_unread: boolean;
    unread_count: number;
}

interface User {
    id: string;
    email: string;
}

export default function AdminChatPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const messageEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    const [contracts, setContracts] = useState<ContractWithUnread[]>([]);
    const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
    const [contractUser, setContractUser] = useState<User | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // Pagination state
    const [pagination, setPagination] = useState({
        limit: 20,
        skip: 0,
        hasMore: true
    });

    const [loading, setLoading] = useState(true);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [sendingMessage, setSendingMessage] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
        fetchContracts(true); // Reset pagination

        // Check if contract ID is in URL parameters
        const contractId = searchParams.get('id');
        if (contractId) {
            fetchContractMessages(contractId);
        }

        // Set up polling for unread notifications
        const notificationInterval = setInterval(() => fetchContracts(true), 30000); // Every 30 seconds

        return () => {
            clearInterval(notificationInterval);
        };
    }, [searchParams]);

    // Effect to handle search term changes
    useEffect(() => {
        const delaySearch = setTimeout(() => {
            fetchContracts(true); // Reset pagination when search term changes
        }, 500);

        return () => clearTimeout(delaySearch);
    }, [searchTerm]);

    useEffect(() => {
        // Scroll to bottom of messages whenever messages change
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const fetchContracts = async (resetPagination = false) => {
        try {
            setLoading(true);
            setError(null);

            // Reset pagination if requested
            if (resetPagination) {
                setPagination({
                    limit: 20,
                    skip: 0,
                    hasMore: true
                });
            }

            // Set up query parameters
            const params = new URLSearchParams();
            params.append('limit', pagination.limit.toString());
            params.append('skip', resetPagination ? '0' : pagination.skip.toString());

            // Add name filter if search term exists
            if (searchTerm) {
                params.append('name', searchTerm);
            }

            const response = await fetch(`${backendUrl}/api/admin/chat/contracts/unread?${params.toString()}`, {
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

            // If we're loading more (not resetting), append to existing contracts
            if (!resetPagination && pagination.skip > 0) {
                setContracts(prevContracts => [...prevContracts, ...(data.contracts || [])]);
            } else {
                setContracts(data.contracts || []);
            }

            // Update pagination state based on response
            setPagination(prev => ({
                ...prev,
                skip: resetPagination ? (data.pagination?.limit || 20) : prev.skip + (data.pagination?.limit || 20),
                hasMore: Array.isArray(data.contracts) && data.contracts.length >= (data.pagination?.limit || 20)
            }));
        } catch (error: any) {
            console.error("Error fetching contracts:", error);
            setError(error.message || "Failed to load contracts");
            toast.error("Failed to load contracts");
        } finally {
            setLoading(false);
        }
    };

    // Load more contracts
    const loadMoreContracts = () => {
        if (!loading && pagination.hasMore) {
            fetchContracts(false);
        }
    };

    const fetchContractMessages = async (contractId: string) => {
        try {
            setMessagesLoading(true);

            const response = await fetch(`${backendUrl}/api/admin/chat/contracts/${contractId}/messages`, {
                method: "GET",
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                if (response.status === 401) {
                    toast.error("Session expired. Please log in again.");
                    router.push("/admin/login");
                    return;
                }
                throw new Error(`Failed to fetch messages: ${response.status}`);
            }

            const data = await response.json();
            setSelectedContract(data.contract || null);
            setContractUser(data.user || null);
            setMessages(data.messages || []);

            // Mark unread user messages as read
            // Add a safety check to make sure data.messages exists and is an array
            if (Array.isArray(data.messages)) {
                data.messages.forEach(message => {
                    if (message.sender_role === 'user' && !message.is_read) {
                        markMessageAsRead(message.id);
                    }
                });
            }

            // Update contract list to reflect the reading of messages
            fetchContracts(true);
        } catch (error: any) {
            console.error("Error fetching messages:", error);
            toast.error("Failed to load messages");
        } finally {
            setMessagesLoading(false);
        }
    };

    const sendMessage = async () => {
        if (!selectedContract || !newMessage.trim()) return;

        try {
            setSendingMessage(true);

            const response = await fetch(`${backendUrl}/api/admin/chat/contracts/${selectedContract.id}/messages`, {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify({ content: newMessage })
            });

            if (!response.ok) {
                if (response.status === 401) {
                    toast.error("Session expired. Please log in again.");
                    router.push("/admin/login");
                    return;
                }
                throw new Error(`Failed to send message: ${response.status}`);
            }

            const data = await response.json();

            // Add the new message to the list
            setMessages(prevMessages => [...prevMessages, data.data]);

            // Clear the input
            setNewMessage("");
            toast.success("Message sent to user");
        } catch (error: any) {
            console.error("Error sending message:", error);
            toast.error("Failed to send message");
        } finally {
            setSendingMessage(false);
        }
    };

    const markMessageAsRead = async (messageId: string) => {
        try {
            const response = await fetch(`${backendUrl}/api/admin/chat/messages/${messageId}/read`, {
                method: "PUT",
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                console.error(`Failed to mark message as read: ${response.status}`);
                return;
            }

            // Update the message in the state
            setMessages(prevMessages =>
                prevMessages.map(msg =>
                    msg.id === messageId ? { ...msg, is_read: true } : msg
                )
            );
        } catch (error: any) {
            console.error("Error marking message as read:", error);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // We no longer need to filter contracts locally since we're filtering on the server

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

    const formatMessageTime = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit"
            });
        } catch (e) {
            return "Invalid time";
        }
    };

    // Get contract status badge
    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return "bg-green-900/30 text-green-400";
            case 'in_progress':
                return "bg-blue-900/30 text-blue-400";
            case 'pending':
                return "bg-amber-900/30 text-amber-400";
            case 'rejected':
                return "bg-red-900/30 text-red-400";
            default:
                return "bg-zinc-900/30 text-zinc-400";
        }
    };

    // Loading spinner component
    const LoadingSpinner = () => (
        <div className="flex-1 bg-black p-6 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full border-4 border-zinc-700 border-t-blue-500 animate-spin"></div>
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
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
            >
                Retry
            </button>
        </div>
    );

    // Render the contracts list view
    const renderContractsList = () => {
        if (contracts.length === 0 && searchTerm) {
            return (
                <div className="text-center py-12">
                    <FileSearch size={48} className="text-zinc-700 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Matching Contracts</h3>
                    <p className="text-zinc-400 mb-6">Try a different search term</p>
                </div>
            );
        }

        if (contracts.length === 0) {
            return (
                <div className="text-center py-12">
                    <FileSearch size={48} className="text-zinc-700 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Contracts Available</h3>
                    <p className="text-zinc-400 mb-6">There are no contracts to chat about yet</p>
                </div>
            );
        }

        return (
            <div className="space-y-3">
                {contracts.map((contract) => (
                    <div
                        key={contract.contract_id}
                        onClick={() => {
                            fetchContractMessages(contract.contract_id);
                            // Update URL without full refresh
                            const url = new URL(window.location.href);
                            url.searchParams.set('id', contract.contract_id);
                            window.history.pushState({}, '', url);
                        }}
                        className={`p-4 border rounded-lg transition-all cursor-pointer hover:bg-zinc-900/50 ${selectedContract && selectedContract.id === contract.contract_id
                            ? "border-blue-500/50 bg-zinc-900/50"
                            : "border-zinc-800 bg-zinc-900/20"
                            }`}
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                    <FileText size={16} className="text-blue-400" />
                                    <h3 className="font-medium text-white">{contract.contract_name}</h3>
                                    {contract.has_unread && contract.unread_count > 0 && (
                                        <span className="flex items-center justify-center bg-blue-500 text-black text-xs font-bold rounded-full h-5 min-w-5 px-1.5">
                                            {contract.unread_count}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center space-x-2 text-xs text-zinc-400">
                                    <span className="flex items-center">
                                        <MessageSquare size={12} className="mr-1" />
                                        {contract.has_unread ?
                                            <span className="text-blue-400">New messages</span> :
                                            <span>No new messages</span>
                                        }
                                    </span>
                                </div>
                            </div>
                            <div>
                                <ChevronRight size={16} className="text-zinc-500" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    // Render the chat view
    const renderChatView = () => {
        if (!selectedContract) return null;

        return (
            <div className="flex flex-col h-full">
                {/* Chat header */}
                <div className="p-4 border-b border-zinc-800 bg-zinc-900/70">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div>
                                <h2 className="text-lg font-medium text-white flex items-center">
                                    {selectedContract.name}
                                    {selectedContract.is_deleted && (
                                        <span className="ml-2 text-xs text-red-500 flex items-center">
                                            <Trash2 size={12} className="mr-1" /> Deleted
                                        </span>
                                    )}
                                </h2>
                                <div className="flex items-center text-xs text-zinc-400 mt-1">
                                    <span className={`px-2 py-0.5 rounded-full mr-2 ${getStatusBadge(selectedContract.status)}`}>
                                        {selectedContract.status.replace('_', ' ')}
                                    </span>
                                    <span>ID: {selectedContract.id.substring(0, 8)}...</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            {contractUser && (
                                <div className="px-3 py-1.5 bg-zinc-800 text-white text-sm rounded-lg flex items-center">
                                    <User size={14} className="mr-2" />
                                    <span>{contractUser.email}</span>
                                </div>
                            )}
                            <button
                                onClick={() => router.push(`/admin/contracts?id=${selectedContract.id}`)}
                                className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-500 transition-colors"
                            >
                                View Contract
                            </button>
                        </div>
                    </div>
                </div>

                {/* Messages area - Use the ScrollableMessageArea component */}
                <ScrollableMessageArea
                    messages={messages}
                    messagesLoading={messagesLoading}
                    formatMessageTime={formatMessageTime}
                />

                {/* Message input area */}
                <div className="p-4 border-t border-zinc-800 bg-zinc-900/70">
                    <div className="flex items-end space-x-2">
                        <div className="flex-1">
                            <textarea
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type your message to the user..."
                                className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white resize-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                rows={2}
                                disabled={selectedContract?.is_deleted}
                            />
                            <p className="text-xs text-zinc-500 mt-1">Press Enter to send, Shift+Enter for new line</p>
                        </div>
                        <button
                            onClick={sendMessage}
                            disabled={!newMessage.trim() || sendingMessage || selectedContract?.is_deleted}
                            className={`p-3 rounded-lg ${!newMessage.trim() || sendingMessage || selectedContract?.is_deleted
                                ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-500'
                                } transition-colors`}
                        >
                            {sendingMessage ? (
                                <div className="h-5 w-5 rounded-full border-2 border-zinc-700 border-t-blue-400 animate-spin"></div>
                            ) : (
                                <Send size={20} />
                            )}
                        </button>
                    </div>
                    {selectedContract?.is_deleted && (
                        <p className="text-xs text-red-500 mt-2">Cannot send messages to a deleted contract</p>
                    )}
                </div>
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
                        <h1 className="text-2xl font-bold text-white">Admin Chat</h1>
                        <p className="text-zinc-400 text-sm">
                            Communicate with users about their contract reviews
                        </p>
                    </div>
                    <div className="flex space-x-3">
                        <button
                            onClick={() => router.push('/contracts')}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
                        >
                            <Shield size={18} />
                            <span>Manage Contracts</span>
                        </button>
                    </div>
                </div>

                {/* Main content area with list/chat view */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
                    <div className={`md:col-span-1 ${selectedContract ? 'hidden md:block' : ''}`}>
                        <div className="p-5 border border-zinc-800 rounded-lg bg-zinc-900/50 h-full overflow-y-auto">
                            <div className="flex flex-col space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-medium text-white">User Contracts</h2>

                                    {/* Total unread count */}
                                    {contracts.reduce((acc, curr) => acc + curr.unread_count, 0) > 0 && (
                                        <div className="flex items-center bg-blue-900/30 text-blue-400 px-2 py-1 rounded-lg text-xs">
                                            <Bell size={14} className="mr-1" />
                                            <span>{contracts.reduce((acc, curr) => acc + curr.unread_count, 0)} unread</span>
                                        </div>
                                    )}
                                </div>

                                {/* Search input */}
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search contracts..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full p-2 pl-8 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                    />
                                    <FileSearch size={16} className="absolute left-2.5 top-2.5 text-zinc-500" />
                                </div>

                                {loading ? (
                                    <div className="flex justify-center py-8">
                                        <div className="h-6 w-6 rounded-full border-2 border-zinc-700 border-t-blue-400 animate-spin"></div>
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
                                    <div className="overflow-y-auto">
                                        {renderContractsList()}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={`md:col-span-2 ${selectedContract ? '' : 'hidden md:block'}`}>
                        {selectedContract ? (
                            <div className="border border-zinc-800 rounded-lg bg-zinc-900/50 h-full flex flex-col">
                                {renderChatView()}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full p-12 border border-zinc-800 rounded-lg bg-zinc-900/50">
                                <MessageSquare size={48} className="text-zinc-700 mb-4" />
                                <h3 className="text-xl font-semibold text-white mb-2">Select a Contract</h3>
                                <p className="text-zinc-400 text-center">
                                    Choose a contract from the list to view and send messages to the user
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Back button (mobile only) */}
                {selectedContract && (
                    <button
                        onClick={() => {
                            setSelectedContract(null);
                            setContractUser(null);
                            // Remove ID from URL
                            const url = new URL(window.location.href);
                            url.searchParams.delete('id');
                            window.history.pushState({}, '', url);
                        }}
                        className="md:hidden flex items-center text-zinc-400 hover:text-white transition-colors"
                    >
                        <ChevronLeft size={16} className="mr-1" />
                        <span>Back to contracts</span>
                    </button>
                )}
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
            <AdminSidebar onToggle={setSidebarCollapsed} />
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
