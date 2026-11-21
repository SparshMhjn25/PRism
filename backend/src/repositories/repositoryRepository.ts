import pool from "../config/pool.js";

export async function getAllRepos(){
    const { rows } = await pool.query("SELECT * FROM repositories;");
    return rows;
}

export async function getRepoById(id:number){
    const { rows } = await pool.query("SELECT * FROM repositories WHERE id = $1", [id]);
    return rows[0];
}

export async function getRepoId(repoId: number){
    const { rows } = await pool.query('SELECT id FROM repositories WHERE github_repo_id = $1;', [repoId]);
    if (rows.length === 0) {
        throw new Error("Repository doesnt exists");
    }
    return rows[0].id;
}

export async function insertRepo(github_repo_id: number, owner_login: string, name: string, default_branch: string){
    const { rows } = await pool.query('INSERT INTO repositories(github_repo_id, owner_login, name, default_branch) VALUES ($1, $2, $3, $4) ON CONFLICT (github_repo_id) DO UPDATE SET  owner_login = EXCLUDED.owner_login, name = EXCLUDED.name, default_branch = EXCLUDED.default_branch RETURNING id;', [github_repo_id, owner_login, name, default_branch]);
    return rows[0].id;
}