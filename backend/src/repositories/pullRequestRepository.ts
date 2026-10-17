import pool from "../config/pool.js";

export async function getAllPullRequests(){
    const { rows } = await pool.query("SELECT * FROM pull_requests;");
    return rows;
}

export async function getPullRequestById(id: number){
    const { rows } = await pool.query("SELECT * FROM pull_requests WHERE id = $1;", [id]);
    return rows[0];
}