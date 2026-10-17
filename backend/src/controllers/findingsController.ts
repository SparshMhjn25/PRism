import { getAllFindings, getFindingById } from '../repositories/findingRepository.js';
import type {Request, Response} from 'express';

export async function getAllFindingsController(req: Request, res: Response){
    try{
        const result = await getAllFindings();
        res.json(result);
    }catch(err){
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function getFindingByIdController(req: Request, res: Response){
    try{
        const id = Number(req.params.id);

        if(!Number.isInteger(id) || id <= 0){
            return res.status(400).json({ error: "Invalid finding ID" });
        }

        const result = await getFindingById(id);
        if(!result){
            return res.status(404).json({ error: "Finding Not Found" });
        }
        res.json(result);
    }catch(err){
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}