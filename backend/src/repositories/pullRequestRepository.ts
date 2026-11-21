import pool from "../config/pool.js";

export async function getAllPullRequests(){
    const { rows } = await pool.query("SELECT * FROM pull_requests;");
    return rows;
}

export async function getPullRequestById(id: number){
    const { rows } = await pool.query("SELECT * FROM pull_requests WHERE id = $1;", [id]);
    return rows[0];
}

export async function getPullRequestId(pr_number: number, repoId: number){
    const {rows} = await pool.query('SELECT id FROM pull_requests WHERE pr_number = $1 AND repository_id = $2;', [pr_number, repoId]);
    if(rows.length === 0){
        throw new Error('Pull Request not found');
    }
    return rows[0].id;
}

export async function insertPullRequest(github_pr_id: number, pr_number: number, repo_id: number, title: string, author_id: number, author_name: string, source_branch: string, target_branch: string, state: string){
    const { rows } = await pool.query("INSERT INTO pull_requests (github_pr_id, pr_number, repository_id, title, author_github_id, author_username, source_branch, target_branch, state) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (github_pr_id) DO UPDATE SET pr_number = EXCLUDED.pr_number, repository_id = EXCLUDED.repository_id, title = EXCLUDED.title, author_github_id = EXCLUDED.author_github_id, author_username = EXCLUDED.author_username, source_branch = EXCLUDED.source_branch, target_branch = EXCLUDED.target_branch, state = EXCLUDED.state, updated_at = NOW() RETURNING id;", [github_pr_id, pr_number, repo_id, title, author_id, author_name, source_branch, target_branch, state]);
    return rows[0].id;
}