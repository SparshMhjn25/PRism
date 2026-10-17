import pool from "../config/pool.js";

export async function getAllReviews(){
    const { rows } = await pool.query("SELECT * FROM reviews;");
    return rows;
}

export async function getReviewById(id: number){
    const { rows } = await pool.query("SELECT * FROM reviews WHERE id = $1", [id]);
    return rows[0];
}