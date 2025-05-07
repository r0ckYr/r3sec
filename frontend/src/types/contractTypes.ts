// Types definitions for contracts
export interface Contract {
    id: string;
    name: string;
    description: string;
    upload_type: string;
    upload_url: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface Finding {
    id: string;
    report_id: string;
    title: string;
    description: string;
    severity: string;
    location: string;
    recommendation: string;
    created_at: string;
}

export interface AuditReport {
    id: string;
    contract_id: string;
    report_url: string;
    total_findings: number;
    findings_count: number;
    severity_breakdown: {
        critical: number;
        high: number;
        medium: number;
        low: number;
        info: number;
    };
    uploaded_at: string;
    status: string;
}

export interface AuditLog {
    id: string;
    contract_id: string;
    event: string;
    actor_id: string;
    actor_role: string;
    created_at: string;
}

export interface ContractDetailsData {
    contract: Contract;
    audit_report?: AuditReport;
    findings?: Finding[];
    audit_logs?: AuditLog[];
}
