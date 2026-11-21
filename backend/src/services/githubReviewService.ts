import type{ Finding, GitHubReviewComment } from "../types/finding.js";

export function githubReviewService(findings: Finding[]): GitHubReviewComment[]{
    const githubReviewComment = findings.map(finding =>{
        const path = finding.file_path;
        const line = finding.line_number;
        const side = "RIGHT" as const;
        const body = `${finding.severity} ${finding.category} ${finding.message} ${finding.suggestion}`;
        return {
            path,
            line,
            side,
            body
        }
    })
    return githubReviewComment;
}
