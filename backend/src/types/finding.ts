export type Finding = {
    severity: 'critical'|'high'|'medium'|'low';
    category: 'bug'|'security'|'performance'|'architecture'|'style';
    file_path: string;
    line_number: number;
    message: string;
    suggestion: string;
};

export type ReviewResult = {
    summary: string;
    findings: Finding[];
};

export type ReviewStatus = 'pending' | 'completed' | 'failed';

export type GitHubReviewComment = {
    path: string;
    line: number;
    side: "RIGHT";
    body: string;
}

export type WebhookDeliveryStatus = 'processing' | 'completed' | 'failed';