import pool from "../config/pool.js";

export async function getAllRepos(){
    const { rows } = await pool.query("SELECT * FROM repositories;");
    return rows;
}

export async function getRepoById(id:number){
    const { rows } = await pool.query("SELECT * FROM repositories WHERE id = $1", [id]);
    return rows[0];
}