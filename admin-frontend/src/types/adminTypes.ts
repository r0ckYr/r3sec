export interface Contract {
    id: string;
    user_id: string;
    name: string;
    description: string;
    upload_type: string;
    upload_url: string;
    status: string;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
}

export interface ContractWithUser {
    contract: Contract;
    has_report: boolean;
    report_id: string;
    user_email: string;
}

export interface User {
    id: string;
    email: string;
    is_deleted: boolean;
    is_verified: boolean;
    email_notifications_enabled: boolean;
    created_at: string;
    updated_at: string;
}

export interface AuditLog {
    id: string;
    contract_id: string;
    event: string;
    actor_id: string;
    actor_role: string;
    created_at: string;
}

export interface Finding {
    title: string;
    severity: "critical" | "high" | "medium" | "low" | "info";
    description: string;
    recommendation: string;
    location?: string;
}

export interface Pagination {
    limit: number;
    page: number;
    pages: number;
    total: number;
}

export interface AuditReport {
    id: string;
    contract_id: string;
    report_url: string;
    summary: string;
    severity_summary: string;
    findings_count: number;
    uploaded_at: string;
    updated_at: string;
}

export interface AdminUser {
    id: string;
    email: string;
    role: string;
    created_at: string;
    updated_at?: string;
}
