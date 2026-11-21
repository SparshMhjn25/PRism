import express from "express";
import { authController, githubCallbackController } from "../controllers/authController.js";
const authRouter = express.Router();

authRouter.get('/github', authController);
authRouter.get('/github/callback', githubCallbackController);

export default authRouter;