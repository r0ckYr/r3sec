// components/admin/ContractDetails.tsx

import React from 'react';
import {
    RefreshCw,
    Upload,
    ExternalLink,
    ChevronRight,
    Mail,
    Shield,
    CheckCircle,
    FileText,
    Clock,
    CircleDashed,
    AlertCircle
} from 'lucide-react';
import { Contract, User, AuditLog } from '@/types/adminTypes';
import { formatDate, getStatusColor } from '@/app/components/UIComponents';

interface ContractDetailsProps {
    contractDetails: {
        contract: Contract;
        user?: User;
        audit_logs?: AuditLog[];
    } | null;
    onStatusUpdate: () => void;
    onReportSubmit: () => void;
    onBack: () => void;
}

const ContractDetails: React.FC<ContractDetailsProps> = ({
    contractDetails,
    onStatusUpdate,
    onReportSubmit,
    onBack
}) => {
    if (!contractDetails) return null;

    const { contract, user, audit_logs } = contractDetails;

    // Status icon component
    const StatusIcon = ({ status }: { status: string }) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return <CheckCircle size={16} className="text-blue-400" />;
            case 'in_progress':
                return <Clock size={16} className="text-amber-400" />;
            case 'pending':
                return <CircleDashed size={16} className="text-zinc-400" />;
            case 'failed':
                return <AlertCircle size={16} className="text-red-400" />;
            default:
                return <CircleDashed size={16} className="text-zinc-400" />;
        }
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
                    <button
                        onClick={onStatusUpdate}
                        className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors text-sm flex items-center space-x-1"
                    >
                        <RefreshCw size={14} />
                        <span>Update Status</span>
                    </button>

                    <button
                        onClick={onReportSubmit}
                        className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors text-sm flex items-center space-x-1"
                    >
                        <Upload size={14} />
                        <span>Submit Report</span>
                    </button>
                </div>
            </div>

            {/* Contract details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-5 border border-zinc-800 rounded-lg bg-zinc-900/50">
                    <h3 className="text-lg font-medium text-white mb-4">Contract Information</h3>

                    <div className="space-y-4">
                        <div>
                            <p className="text-zinc-400 text-sm">Description</p>
                            <p className="text-white">
                                {contract.description || "No description provided"}
                            </p>
                        </div>

                        <div>
                            <p className="text-zinc-400 text-sm">Upload Type</p>
                            <div className="flex items-center mt-1">
                                <UploadTypeIcon type={contract.upload_type} />
                                <span className="ml-2 text-white capitalize">{contract.upload_type}</span>
                            </div>
                        </div>

                        <div>
                            <p className="text-zinc-400 text-sm">Source URL / Contract Address</p>
                            <a
                                href={contract.upload_url.startsWith("http") ? contract.upload_url : "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:underline break-all flex items-center mt-1"
                            >
                                {contract.upload_url}
                                {contract.upload_url.startsWith("http") && (
                                    <ExternalLink size={14} className="ml-1 inline-block" />
                                )}
                            </a>
                        </div>

                        <div>
                            <p className="text-zinc-400 text-sm">Status</p>
                            <div className="flex items-center mt-1">
                                <StatusIcon status={contract.status} />
                                <span className={`ml-2 capitalize ${getStatusColor(contract.status)}`}>{contract.status}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-5 border border-zinc-800 rounded-lg bg-zinc-900/50">
                    <h3 className="text-lg font-medium text-white mb-4">User Information</h3>

                    {user ? (
                        <div className="space-y-4">
                            <div>
                                <p className="text-zinc-400 text-sm">Email</p>
                                <div className="flex items-center mt-1">
                                    <Mail size={16} className="text-zinc-400 mr-2" />
                                    <p className="text-white">{user.email}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-zinc-400 text-sm">Account Status</p>
                                <div className="flex items-center mt-1">
                                    <span className={`px-2 py-0.5 text-xs rounded-full ${user.is_verified ? 'bg-green-900/30 text-green-400' : 'bg-amber-900/30 text-amber-400'}`}>
                                        {user.is_verified ? 'Verified' : 'Unverified'}
                                    </span>
                                    {user.is_deleted && (
                                        <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-900/30 text-red-400">
                                            Deleted
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <p className="text-zinc-400 text-sm">Joined</p>
                                <p className="text-white">{formatDate(user.created_at)}</p>
                            </div>

                            <div>
                                <p className="text-zinc-400 text-sm">Notifications</p>
                                <p className="text-white">{user.email_notifications_enabled ? 'Enabled' : 'Disabled'}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-40">
                            <p className="text-zinc-500">User information not available</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Audit Logs */}
            {audit_logs && audit_logs.length > 0 && (
                <div className="p-5 border border-zinc-800 rounded-lg bg-zinc-900/50">
                    <h3 className="text-lg font-medium text-white mb-4">Audit Timeline</h3>

                    <div className="relative">
                        {/* Vertical line */}
                        <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-zinc-700"></div>

                        {/* Timeline items */}
                        <div className="space-y-6 ml-2">
                            {audit_logs.map((log, index) => (
                                <div key={log.id} className="relative pl-8">
                                    {/* Timeline dot */}
                                    <div className={`absolute left-0 top-1 h-6 w-6 rounded-full flex items-center justify-center ${index === 0 ? 'bg-blue-600' : 'bg-zinc-800'}`}>
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
                                                    {log.actor_role === 'admin' ? 'By Admin' : 'By User'} • {formatDate(log.created_at)}
                                                </p>
                                            </div>
                                            {log.event.includes('Status Changed') && (
                                                <span className={`mt-2 sm:mt-0 px-2 py-0.5 text-xs self-start rounded-full ${getStatusColor(log.event.split(' ').pop() || '')}`}>
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

            {/* Go back button */}
            <button
                onClick={onBack}
                className="mt-4 flex items-center text-zinc-400 hover:text-white transition-colors"
            >
                <ChevronRight size={16} className="rotate-180 mr-1" />
                <span>Back to contracts list</span>
            </button>
        </div>
    );
};

// Helper component for upload type icon
const UploadTypeIcon = ({ type }: { type: string }) => {
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

export default ContractDetails;
