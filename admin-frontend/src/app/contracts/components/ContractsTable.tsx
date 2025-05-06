import React from 'react';
import {
    Mail,
    Eye,
    ExternalLink,
    Shield,
    FileText,
    CheckSquare,
    CheckCircle,
    Clock,
    CircleDashed,
    AlertCircle,
    Trash2
} from 'lucide-react';
import { Contract, ContractWithUser } from '@/types/adminTypes';
import { formatDate, getStatusColor } from '@/app/components/UIComponents';

interface ContractsTableProps {
    contracts: ContractWithUser[];
    selectedContract: Contract | null;
    onContractSelect: (contract: Contract) => void;
}

const ContractsTable: React.FC<ContractsTableProps> = ({
    contracts,
    selectedContract,
    onContractSelect
}) => {
    // If no contracts, show empty state
    if (contracts.length === 0) {
        return (
            <div className="text-center py-12">
                <Shield size={48} className="text-zinc-700 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Contracts Found</h3>
                <p className="text-zinc-400 mb-6">Adjust your filters or search to find contracts</p>
            </div>
        );
    }

    // Get status icon
    const StatusIcon = ({ status, isDeleted }: { status: string, isDeleted: boolean }) => {
        if (isDeleted) {
            return <Trash2 size={16} className="text-red-500" />;
        }

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

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-zinc-400 uppercase border-b border-zinc-800">
                    <tr>
                        <th scope="col" className="px-4 py-3">Name</th>
                        <th scope="col" className="px-4 py-3">Status</th>
                        <th scope="col" className="px-4 py-3">Type</th>
                        <th scope="col" className="px-4 py-3">User</th>
                        <th scope="col" className="px-4 py-3">Date</th>
                        <th scope="col" className="px-4 py-3">Report</th>
                        <th scope="col" className="px-4 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {contracts.map((item) => (
                        <tr
                            key={item.contract.id}
                            className={`border-b border-zinc-800 hover:bg-zinc-900/50 transition-colors cursor-pointer ${selectedContract && selectedContract.id === item.contract.id ? 'bg-zinc-900/50' : ''
                                } ${item.contract.is_deleted ? 'opacity-60' : ''
                                }`}
                            onClick={() => onContractSelect(item.contract)}
                        >
                            <td className="px-4 py-3 font-medium text-white">
                                <div className="flex items-center">
                                    <StatusIcon
                                        status={item.contract.status}
                                        isDeleted={item.contract.is_deleted}
                                    />
                                    <span className="ml-2">
                                        {item.contract.name}
                                        {item.contract.is_deleted && (
                                            <span className="ml-2 text-xs text-red-500">(Deleted)</span>
                                        )}
                                    </span>
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                {item.contract.is_deleted ? (
                                    <span className="px-2.5 py-0.5 rounded-full text-xs bg-red-950 text-red-400">
                                        Deleted
                                    </span>
                                ) : (
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs ${getStatusColor(item.contract.status)}`}>
                                        {item.contract.status}
                                    </span>
                                )}
                            </td>
                            <td className="px-4 py-3 text-zinc-400">
                                <div className="flex items-center">
                                    {getUploadTypeIcon(item.contract.upload_type)}
                                    <span className="ml-2 capitalize">{item.contract.upload_type}</span>
                                </div>
                            </td>
                            <td className="px-4 py-3 text-zinc-400">
                                <div className="flex items-center">
                                    <Mail size={14} className="mr-2" />
                                    {item.user_email}
                                </div>
                            </td>
                            <td className="px-4 py-3 text-zinc-400">
                                {formatDate(item.contract.created_at)}
                            </td>
                            <td className="px-4 py-3">
                                {item.has_report ? (
                                    <span className="text-blue-400 flex items-center">
                                        <CheckSquare size={14} className="mr-1" />
                                        Yes
                                    </span>
                                ) : (
                                    <span className="text-zinc-500">No</span>
                                )}
                            </td>
                            <td className="px-4 py-3 text-right">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onContractSelect(item.contract);
                                    }}
                                    className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded hover:bg-blue-600/30 transition-colors"
                                >
                                    <Eye size={14} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ContractsTable;
