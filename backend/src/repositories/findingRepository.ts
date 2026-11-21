import pool from "../config/pool.js";
import type { Finding } from "../types/finding.js";
import type { PoolClient } from "pg";

export async function getAllFindings(){
    const { rows } = await pool.query("SELECT * FROM findings;");
    return rows;
}

export async function getFindingById(id: number){
    const { rows } = await pool.query("SELECT * FROM findings WHERE id = $1", [id]);
    return rows[0];
}

export async function insertFinding(review_id: number, severity: Finding["severity"], category: Finding["category"], file_path: string, line_number: number, message: string, suggestion: string, client: PoolClient){
    const { rows } = await client.query('INSERT INTO findings (review_id, severity, category, file_path, line_number, message, suggestion) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id;', [review_id, severity, category, file_path, line_number, message, suggestion]);
    return rows[0].id;
}