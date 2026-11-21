import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type Finding = {
    id: number;
    severity: string;
    category: string;
    file_path: string;
    line_number: number;
    message: string;
    suggestion: string;
}

type Review = {
    id: string;
    pull_request_id: string;
    commit_sha: string;
    status:	"completed" | "pending" | "failed";
    summary: string;
    model_name:	string;
    created_at:	string;
    repository_name: string;
    pr_number: number;  
    pr_title: string;
    author_username: string;
    findings: Finding[];
}

export default function ReviewDetails(){
    const { id } = useParams();
    const url = `http://localhost:3000/reviews/${id}`;

    const [review, setReview] = useState<Review | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(()=>{
        async function fetchReview(){
            try{
                const response = await fetch(url);
                if(!response.ok){
                    throw new Error("Failed to fetch review");
                }
                const data = await response.json();
                setReview(data);
            }catch(err){
                setError(err instanceof Error ? err.message : "Something went wrong");
            }finally{
                setIsLoading(false);
            }
        }
        fetchReview();
    }, [url])

    return(
        <div>
            {isLoading ? (
                <p>Loading review....</p>
            ) : error ? (
                <p>{error}</p>
            ) : !review ? (
                <p>Review not found.</p>
            ) : (
                <div className="review-details">
                    <div className="review-header">
                        <p>{review.repository_name}</p>
                        <h2>#{review.pr_number} - {review.pr_title}</h2>
                        <p>Opened By: {review.author_username}</p>
                    </div>
                    <div className="review-overview">
                        <p>Status: {review.status}</p>
                        <p>AI Model: {review.model_name}</p>
                        <p>Commit SHA: {review.commit_sha.slice(0, 7)}</p>
                        <p>Review Date: {new Date(review.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="review-summary">
                        <h3>AI Review Summary</h3>
                        <p>{review.summary}</p>
                    </div>
                    <div className="findings-section">
                        <h3>Findings ({review.findings.length})</h3>
                        {review.findings.length === 0 ? (
                            <p>No issues found in this review.</p>
                        ) : (
                            <div className="findings-list">
                            {review.findings.map((finding)=>(
                                <div className="finding-card" key={finding.id}>
                                    <div className="finding-header">
                                        <span>{finding.severity}</span>
                                        <span>{finding.category}</span>
                                    </div>

                                    <p>File: {finding.file_path}</p>
                                    <p>Line: {finding.line_number}</p>

                                    <div className="finding-message">
                                        <h4>Issue Description</h4>
                                        <p>{finding.message}</p>
                                    </div>

                                    <div className="finding-suggestion">
                                        <h4>Suggested Fix</h4>
                                        <p>{finding.suggestion}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

