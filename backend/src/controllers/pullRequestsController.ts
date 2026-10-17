import { getAllPullRequests, getPullRequestById } from "../repositories/pullRequestRepository.js";
import type {Request, Response} from 'express';

export async function getAllPullRequestsController(req: Request, res:Response){
    try{
        const result = await getAllPullRequests();
        res.json(result);
    }catch(err){
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function getPullRequestByIdController(req: Request, res: Response){
    try{
        const id = Number(req.params.id);

        if(!Number.isInteger(id) || id <= 0){
            return res.status(400).json({ error: "Invalid pull_request ID" });
        }

        const result = await getPullRequestById(id);
        if(!result){
            return res.status(404).json({ error: "Pull_Request Not Found" });
        }
        res.json(result);
    }catch(err){
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}