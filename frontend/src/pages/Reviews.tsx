import { useState, useEffect} from "react"
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Review = {
    review_id: string;
    status: string;
    model_name: string;
    github_repo_id: string;
    repository_name: string;
    github_pr_id: string;
    pr_number: number;
    pr_title: string;
    findings_count: string;
}

export default function Reviews(){
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const navigate = useNavigate();

    useEffect(()=>{
        async function fetchReviews() {
            try{
                const response = await fetch("http://localhost:3000/reviews");
                if (!response.ok) {
                    throw new Error("Failed to fetch reviews");
                }
                const data: Review[] = await response.json();
                setReviews(data);
            }catch(err){
                setError(err instanceof Error ? err.message : "Something went wrong");
            }finally{
                setIsLoading(false);
            }
        }
        fetchReviews();
    }, [])

    const filteredReviews = reviews.filter((review)=> (statusFilter === "all" || review.status === statusFilter) && (review.repository_name.toLowerCase().includes(search.toLowerCase()) || review.pr_title.toLowerCase().includes(search.toLowerCase())) )

    return (
        <div className="reviews-content">
            <div className="reviews-header">
                <div>
                    <h2>Reviews</h2>
                    <p>Browse and manage your automated code reviews.</p>
                </div>
            </div>
            <div className="search-header">
                <Search />
                <input type="text" placeholder="Search repositories or pull requests..." value={search} onChange={(e) => setSearch(e.target.value)}/>
            </div>
            <div className="filters-header">
                <button onClick={()=> setStatusFilter("all")} className={statusFilter === "all" ? "active" : ""}>All</button>
                <button onClick={()=> setStatusFilter("completed")} className={statusFilter === "completed" ? "active" : ""}>Completed</button>
                <button onClick={()=> setStatusFilter("pending")} className={statusFilter === "pending" ? "active" : ""}>Pending</button>
                <button onClick={()=> setStatusFilter("failed")} className={statusFilter === "failed" ? "active" : ""}>Failed</button>
            </div>
            <div className="reviews-list">
                {isLoading ? (
                    <p>Loading reviews...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : filteredReviews.length === 0 ? (
                    <p>No reviews found.</p>
                ) : (
                    <table>
                    <thead>
                        <tr>
                            <th>Repository</th>
                            <th>Pull Request</th>
                            <th>Status</th>
                            <th>Findings</th>
                            <th>Model</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredReviews.map((review) => (
                            <tr key={review.review_id}>
                                <td>{review.repository_name}</td>
                                <td>
                                    <strong>#{review.pr_number}</strong>
                                    <p>{review.pr_title}</p>
                                </td>
                                <td>
                                    <span className={`status-badge ${review.status}`}>
                                        {review.status}
                                    </span>
                                </td>
                                <td>{review.findings_count}</td>
                                <td>{review.model_name}</td>
                                <td><button onClick={() => navigate(`/reviews/${review.review_id}`)}>
                                    View
                                </button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                )}
                
            </div>
        </div>
    );
}