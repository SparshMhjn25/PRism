import { getAllReviews, getReviewById } from "../repositories/reviewRepository.js";
import type {Request, Response} from 'express';

export async function getAllReviewsController(req: Request, res: Response){
    try{
        const result = await getAllReviews();
        res.json(result);
    }catch(err){
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function getReviewByIdController(req: Request, res: Response){
    try{
        const id = Number(req.params.id);

        if(!Number.isInteger(id) || id <= 0){
            return res.status(400).json({ error: "Invalid review ID" });
        }

        const result = await getReviewById(id);
        if(!result){
            return res.status(404).json({ error: "Review Not Found" });
        }
        res.json(result);
    }catch(err){
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}