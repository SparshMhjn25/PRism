import express from "express";
import { handleGithubWebhook } from "../controllers/webhookController.js";


const webhookRouter = express.Router();

webhookRouter.post('/github', handleGithubWebhook);

export default webhookRouter;