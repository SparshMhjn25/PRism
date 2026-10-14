import express from "express";
import { getAllReposController, getRepoByIdController } from "../controllers/repositoriesController.js";

const router = express.Router();
router.get('/repositories', getAllReposController);
router.get("/repositories/:id", getRepoByIdController);

export default router;