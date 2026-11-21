import { fetchPullRequestDiff, fetchMetaData, publishReview } from "./githubPullRequestService.js";
import { insertReview, updateReviewStatus, updateReviewSummary } from "../repositories/reviewRepository.js";
import { llmRequest, modelName } from "./llmService.js";
import { insertRepo } from "../repositories/repositoryRepository.js";
import { insertPullRequest } from "../repositories/pullRequestRepository.js";
import { insertFinding } from "../repositories/findingRepository.js";
import pool from "../config/pool.js";
import type { ReviewResult } from "../types/finding.js";
import type { PoolClient } from "pg";
import { githubReviewService } from "./githubReviewService.js";

export async function orchestrationWorkflow(url: string, accessToken: string){
    const metaData = await fetchMetaData(url, accessToken);
    const diff = await fetchPullRequestDiff(url, accessToken);
    
    
    const github_repo_id = metaData.base.repo.id;
    const owner = metaData.base.repo.owner.login;
    const repo_name = metaData.base.repo.name;
    const default_branch = metaData.base.repo.default_branch;
    
    const github_pr_id = metaData.id;
    const pr_number = metaData.number;
    const pr_title = metaData.title;
    const author_id = metaData.user.id;
    const author_name = metaData.user.login;
    const source_branch = metaData.head.ref;
    const target_branch = metaData.base.ref;
    const state = metaData.merged === true ? 'merged' : metaData.state;
    
    const repo_id = await insertRepo(github_repo_id, owner, repo_name, default_branch);
    const pr_id = await insertPullRequest(github_pr_id, pr_number, repo_id, pr_title, author_id, author_name, source_branch, target_branch, state);
    
    console.log("Fetched PR diff:");
    console.log(diff);
    
    const review_id = await insertReview(pr_id, metaData.head.sha, 'pending', null, modelName);
    let llmResult: ReviewResult;
    try{
        llmResult = await llmRequest(diff);
        await updateReviewSummary(review_id, llmResult.summary);
    }catch(err){
        await updateReviewStatus(review_id, 'failed');
        throw err;
    }
    
    //Client aquisition
    // const client = await pool.connect();
    let client: PoolClient | null = null;
    try{
        client = await pool.connect();
        try{
            await client.query("BEGIN");
            for(let finding of llmResult.findings){
                await insertFinding(review_id, finding.severity, finding.category, finding.file_path, finding.line_number, finding.message, finding.suggestion, client);
            }
            await client.query("COMMIT");
        }catch(err){
            await client.query("ROLLBACK");
            throw err;
        }
    }catch(err){
        await updateReviewStatus(review_id, 'failed');
        throw err;
    }finally{
        if(client){
            client.release();
        }
    }

    await updateReviewStatus(review_id, "completed");

    const comments = githubReviewService(llmResult.findings);

    await publishReview(
        `${url}/reviews`,
        accessToken,
        metaData.head.sha,
        llmResult.summary,
        comments
    )
}