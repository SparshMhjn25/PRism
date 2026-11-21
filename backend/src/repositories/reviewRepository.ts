import pool from "../config/pool.js";
import type { ReviewStatus } from "../types/finding.js";

export async function getAllReviews(){
    const { rows } = await pool.query("SELECT r.id AS review_id, r.status, r.model_name, repo.github_repo_id, repo.name AS repository_name, pr.github_pr_id, pr.pr_number, pr.title AS pr_title, COUNT(f.id) AS findings_count FROM reviews r JOIN pull_requests pr ON r.pull_request_id = pr.id JOIN repositories repo ON pr.repository_id = repo.id LEFT JOIN findings f ON f.review_id = r.id GROUP BY r.id, r.status, r.model_name, repo.github_repo_id, repo.name, pr.github_pr_id, pr.pr_number, pr.title;");
    return rows;
}

export async function getReviewById(id: number){
    const { rows } = await pool.query("SELECT r.*,repo.name AS repository_name, pr.pr_number, pr.title AS pr_title, pr.author_username, COALESCE(JSON_AGG(JSON_BUILD_OBJECT('id', f.id,'severity', f.severity,'category', f.category,'file_path', f.file_path,'line_number', f.line_number,'message', f.message,'suggestion', f.suggestion) ) FILTER (WHERE f.id IS NOT NULL),'[]'::json ) AS findings FROM reviews r LEFT JOIN findings f ON r.id = f.review_id LEFT JOIN pull_requests pr ON r.pull_request_id = pr.id LEFT JOIN repositories repo ON pr.repository_id = repo.id WHERE r.id = $1 GROUP BY r.id, repo.name, pr.pr_number, pr.title, pr.author_username;", [id]);
    return rows[0];
}

export async function insertReview(pull_request_id : number, commit_sha: string, status: ReviewStatus, summary: string | null, model_name: string): Promise<number> {
    const { rows } = await pool.query('INSERT INTO reviews (pull_request_id, commit_sha, status, summary, model_name) VALUES ($1, $2, $3, $4, $5) RETURNING id;', [pull_request_id, commit_sha, status, summary, model_name]);
    if (rows.length === 0) {
        throw new Error("Review insertion did not return an ID");
    }
    return rows[0].id;
}

export async function updateReviewStatus(review_id: number, new_status: ReviewStatus){
    await pool.query("UPDATE reviews SET status = $1 WHERE id = $2", [new_status, review_id]);
}

export async function updateReviewSummary(review_id: number, summary: string){
    await pool.query("UPDATE reviews SET summary = $1 WHERE id = $2",[summary, review_id]);
}