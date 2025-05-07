import React from "react";
import { Download } from "lucide-react";
import { formatDate } from "../../utils/formatters";

const AuditReport = ({ auditReport, findings, onDownload }) => {
    // Calculate severity counts from findings array
    const calculateSeverityCounts = () => {
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

        return severityCounts;
    };

    const severityCounts = calculateSeverityCounts();

    return (
        <div className="p-5 border border-zinc-800 rounded-lg bg-zinc-900/50">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-white">Audit Report</h3>
                {auditReport.report_url && (
                    <button
                        onClick={onDownload}
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

                    <div className="mb-2 bg-zinc-800/50 p-2 rounded-lg text-center">
                        <p className="text-xs text-zinc-400">Total Findings</p>
                        <p className="text-white text-xl font-bold">{auditReport.findings_count || findings?.length || 0}</p>
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
                </div>

                <div>
                    <p className="text-zinc-400 text-sm">Uploaded</p>
                    <p className="text-white">{formatDate(auditReport.uploaded_at)}</p>
                </div>
            </div>
        </div>
    );
};

export default AuditReport;
