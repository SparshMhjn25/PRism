import pool from "../config/pool.js";

export async function getAllFindings(){
    const { rows } = await pool.query("SELECT * FROM findings;");
    return rows;
}

export async function getFindingById(id: number){
    const { rows } = await pool.query("SELECT * FROM findings WHERE id = $1", [id]);
    return rows[0];
}