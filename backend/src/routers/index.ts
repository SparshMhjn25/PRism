import express from "express";
import { getAllReposController, getRepoByIdController } from "../controllers/repositoriesController.js";
import { getAllPullRequestsController, getPullRequestByIdController } from "../controllers/pullRequestsController.js";
import { getAllReviewsController, getReviewByIdController } from "../controllers/reviewsController.js";
import { getAllFindingsController, getFindingByIdController } from "../controllers/findingsController.js";

const router = express.Router();
router.get('/repositories', getAllReposController);
router.get("/repositories/:id", getRepoByIdController);

router.get('/pull-requests', getAllPullRequestsController);
router.get('/pull-requests/:id', getPullRequestByIdController);

router.get('/reviews', getAllReviewsController);
router.get('/reviews/:id', getReviewByIdController);

router.get('/findings', getAllFindingsController);
router.get('/findings/:id', getFindingByIdController);

export default router;