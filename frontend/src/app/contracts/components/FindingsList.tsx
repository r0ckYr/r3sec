import React from "react";
import { getSeverityColor } from "../../utils/formatters";

const FindingsList = ({ findings }) => {
    if (!findings || findings.length === 0) return null;

    return (
        <div className="p-5 border border-zinc-800 rounded-lg bg-zinc-900/50">
            <h3 className="text-lg font-medium text-white mb-4">Security Findings</h3>

            <div className="space-y-4">
                {findings.map((finding) => (
                    <div
                        key={finding.id}
                        className={`p-4 border rounded-lg ${getSeverityColor(finding.severity)}`}
                    >
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                            <h4 className="font-medium text-white">{finding.title}</h4>
                            <span className={`px-2 py-0.5 text-xs self-start rounded-full ${getSeverityColor(finding.severity)}`}>
                                {finding.severity.toUpperCase()}
                            </span>
                        </div>

                        <p className="text-zinc-300 text-sm mb-3">{finding.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div>
                                <p className="text-zinc-400">Location</p>
                                <p className="text-white font-mono text-xs bg-zinc-800/50 p-2 rounded mt-1 overflow-x-auto">
                                    {finding.location || "Not specified"}
                                </p>
                            </div>
                            <div>
                                <p className="text-zinc-400">Recommendation</p>
                                <p className="text-white mt-1">
                                    {finding.recommendation || "No recommendation provided"}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FindingsList;
