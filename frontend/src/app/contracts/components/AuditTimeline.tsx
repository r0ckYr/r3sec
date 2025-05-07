import React from "react";
import { CheckCircle } from "lucide-react";
import { formatDate, getStatusColor } from "../../utils/formatters";

const AuditTimeline = ({ auditLogs }) => {
    if (!auditLogs || auditLogs.length === 0) return null;

    return (
        <div className="p-5 border border-zinc-800 rounded-lg bg-zinc-900/50">
            <h3 className="text-lg font-medium text-white mb-4">Audit Timeline</h3>

            <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-zinc-700"></div>

                {/* Timeline items */}
                <div className="space-y-6 ml-2">
                    {auditLogs.map((log, index) => (
                        <div key={log.id} className="relative pl-8">
                            {/* Timeline dot */}
                            <div className={`absolute left-0 top-1 h-6 w-6 rounded-full flex items-center justify-center ${index === 0 ? 'bg-green-600' : 'bg-zinc-800'
                                }`}>
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
                                            {log.actor_role === 'admin' ? 'By Auditor' : 'By User'} • {formatDate(log.created_at)}
                                        </p>
                                    </div>
                                    {log.event.includes('Status Changed') && (
                                        <span className={`mt-2 sm:mt-0 px-2 py-0.5 text-xs self-start rounded-full ${getStatusColor(log.event.split(' ').pop() || '')
                                            }`}>
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
    );
};

export default AuditTimeline;
