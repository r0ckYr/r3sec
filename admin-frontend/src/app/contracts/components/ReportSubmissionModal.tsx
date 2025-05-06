// components/admin/modals/ReportSubmissionModal.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { X, Upload } from 'lucide-react';
import { Contract } from '@/types/adminTypes';

interface ReportData {
    contract_id: string;
    report_url: string;
    summary: string;
    severity_summary: string;
    findings_count: number;
}

interface ReportSubmissionModalProps {
    selectedContract: Contract | null;
    reportData: ReportData;
    setReportData: (data: ReportData) => void;
    isSubmittingReport: boolean;
    onClose: () => void;
    onSubmit: () => void;
}

const ReportSubmissionModal: React.FC<ReportSubmissionModalProps> = ({
    selectedContract,
    reportData,
    setReportData,
    isSubmittingReport,
    onClose,
    onSubmit
}) => {
    if (!selectedContract) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Submit Audit Report</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
                    >
                        <X size={20} className="text-zinc-400" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-zinc-400 text-sm font-medium mb-2">
                            Contract Name
                        </label>
                        <p className="text-white font-medium">{selectedContract.name}</p>
                    </div>

                    <div>
                        <label className="block text-zinc-400 text-sm font-medium mb-2">
                            Report URL <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={reportData.report_url}
                            onChange={(e) => setReportData({ ...reportData, report_url: e.target.value })}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="https://example.com/report.pdf"
                        />
                        <p className="mt-1 text-xs text-zinc-500">
                            Public URL where the full report can be accessed
                        </p>
                    </div>

                    <div>
                        <label className="block text-zinc-400 text-sm font-medium mb-2">
                            Summary <span className="text-red-400">*</span>
                        </label>
                        <textarea
                            value={reportData.summary}
                            onChange={(e) => setReportData({ ...reportData, summary: e.target.value })}
                            rows={4}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Brief summary of the audit findings"
                        />
                    </div>

                    <div>
                        <label className="block text-zinc-400 text-sm font-medium mb-2">
                            Severity Summary
                        </label>
                        <input
                            type="text"
                            value={reportData.severity_summary}
                            onChange={(e) => setReportData({ ...reportData, severity_summary: e.target.value })}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Critical: 1, High: 2, Medium: 3, Low: 1, Info: 0"
                        />
                    </div>

                    <div>
                        <label className="block text-zinc-400 text-sm font-medium mb-2">
                            Findings Count
                        </label>
                        <input
                            type="number"
                            value={reportData.findings_count}
                            onChange={(e) => setReportData({ ...reportData, findings_count: parseInt(e.target.value) || 0 })}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Total number of findings"
                            min="0"
                        />
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            onClick={onSubmit}
                            disabled={isSubmittingReport || !reportData.report_url || !reportData.summary}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:bg-zinc-600 disabled:text-zinc-400 transition-colors flex items-center space-x-2"
                        >
                            {isSubmittingReport ? (
                                <>
                                    <div className="h-4 w-4 rounded-full border-2 border-zinc-500 border-t-white animate-spin"></div>
                                    <span>Submitting...</span>
                                </>
                            ) : (
                                <>
                                    <Upload size={18} />
                                    <span>Submit Report</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ReportSubmissionModal;
