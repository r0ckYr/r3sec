import React from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Upload, ClipboardCheck } from 'lucide-react';
import { Finding } from '@/types/adminTypes';

interface FindingsSubmissionModalProps {
    findings: Finding[];
    currentFinding: Finding;
    setCurrentFinding: (finding: Finding) => void;
    isSubmittingFindings: boolean;
    onClose: () => void;
    onAddFinding: () => void;
    onRemoveFinding: (index: number) => void;
    onSubmitFindings: () => void;
}

const FindingsSubmissionModal: React.FC<FindingsSubmissionModalProps> = ({
    findings,
    currentFinding,
    setCurrentFinding,
    isSubmittingFindings,
    onClose,
    onAddFinding,
    onRemoveFinding,
    onSubmitFindings
}) => {
    // Get severity color utility
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

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Add Security Findings</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
                    >
                        <X size={20} className="text-zinc-400" />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Current findings list */}
                    {findings.length > 0 && (
                        <div className="border border-zinc-800 rounded-lg p-4">
                            <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                                <ClipboardCheck size={18} className="mr-2 text-blue-400" />
                                Findings to Submit ({findings.length})
                            </h3>

                            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                {findings.map((finding, index) => (
                                    <div key={index} className={`p-3 border rounded-lg ${getSeverityColor(finding.severity)}`}>
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${getSeverityColor(finding.severity)}`}>
                                                    {finding.severity.toUpperCase()}
                                                </span>
                                                <h4 className="font-medium text-white ml-2">{finding.title}</h4>
                                            </div>
                                            <button
                                                onClick={() => onRemoveFinding(index)}
                                                className="p-1 hover:bg-zinc-800/50 rounded-full text-zinc-500"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                        <p className="text-sm mb-2">{finding.description}</p>
                                        <p className="text-xs text-zinc-400">Recommendation: {finding.recommendation}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Add new finding form */}
                    <div className="border border-zinc-800 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-white mb-3">Add New Finding</h3>

                        <div className="space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                                <div className="sm:col-span-3">
                                    <label className="block text-zinc-400 text-sm font-medium mb-2">
                                        Title <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={currentFinding.title}
                                        onChange={(e) => setCurrentFinding({ ...currentFinding, title: e.target.value })}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Reentrancy Vulnerability"
                                    />
                                </div>
                                <div>
                                    <label className="block text-zinc-400 text-sm font-medium mb-2">
                                        Severity <span className="text-red-400">*</span>
                                    </label>
                                    <select
                                        value={currentFinding.severity}
                                        onChange={(e) => setCurrentFinding({ ...currentFinding, severity: e.target.value as any })}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="critical">Critical</option>
                                        <option value="high">High</option>
                                        <option value="medium">Medium</option>
                                        <option value="low">Low</option>
                                        <option value="info">Info</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-zinc-400 text-sm font-medium mb-2">
                                    Description <span className="text-red-400">*</span>
                                </label>
                                <textarea
                                    value={currentFinding.description}
                                    onChange={(e) => setCurrentFinding({ ...currentFinding, description: e.target.value })}
                                    rows={3}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Detailed description of the vulnerability"
                                />
                            </div>

                            <div>
                                <label className="block text-zinc-400 text-sm font-medium mb-2">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    value={currentFinding.location || ""}
                                    onChange={(e) => setCurrentFinding({ ...currentFinding, location: e.target.value })}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="File path or contract function"
                                />
                            </div>

                            <div>
                                <label className="block text-zinc-400 text-sm font-medium mb-2">
                                    Recommendation <span className="text-red-400">*</span>
                                </label>
                                <textarea
                                    value={currentFinding.recommendation}
                                    onChange={(e) => setCurrentFinding({ ...currentFinding, recommendation: e.target.value })}
                                    rows={2}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="How to fix or mitigate the issue"
                                />
                            </div>

                            <div className="pt-2">
                                <button
                                    onClick={onAddFinding}
                                    className="px-4 py-2 bg-blue-600/30 text-blue-400 rounded-lg hover:bg-blue-600/40 transition-colors flex items-center space-x-2"
                                >
                                    <Plus size={18} />
                                    <span>Add to List</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={onSubmitFindings}
                            disabled={isSubmittingFindings || findings.length === 0}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:bg-zinc-600 disabled:text-zinc-400 transition-colors flex items-center space-x-2"
                        >
                            {isSubmittingFindings ? (
                                <>
                                    <div className="h-4 w-4 rounded-full border-2 border-zinc-500 border-t-white animate-spin"></div>
                                    <span>Submitting...</span>
                                </>
                            ) : (
                                <>
                                    <Upload size={18} />
                                    <span>Submit All Findings</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default FindingsSubmissionModal;
