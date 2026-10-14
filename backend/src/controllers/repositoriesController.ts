import { getAllRepos, getRepoById } from "../repositories/repositoryRepository.js";
import type { Request, Response } from 'express';

export async function getAllReposController(req: Request, res: Response){
    try{
        const result = await getAllRepos();
        res.json(result);
    }catch(err){
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function getRepoByIdController(req: Request, res: Response){
    try{
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ error: "Invalid repository ID" });
        }

        const result = await getRepoById(id);
        if(!result){
            return res.status(404).json({ error: "Repository not available" });
        }
        res.json(result);
    }catch(err){
        console.error(err);
        res.status(500).json({ error: "Internal server error"});
    }
}