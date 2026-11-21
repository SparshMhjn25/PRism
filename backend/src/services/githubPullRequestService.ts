import type { GitHubReviewComment } from "../types/finding.js";

export async function fetchMetaData(url: string, accessToken: string){
    const response = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28"
        } 
    })
    if(!response.ok){
        throw new Error(`GitHub PR request failed: ${response.status}`);
    }
    const data = await response.json();
    return data;
}

export async function fetchPullRequestDiff(url: string, accessToken: string){
    const response = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/vnd.github.diff",
            "X-GitHub-Api-Version": "2022-11-28"
        } 
    })
    if(!response.ok){
        throw new Error(`GitHub PR request failed: ${response.status}`);
    }
    const data = await response.text();
    return data;
}

export async function publishReview(url: string, accessToken: string, commitSha: string, summary: string, comments: GitHubReviewComment[]){
    const response = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            'Content-Type': "application/json"
        },
        body: JSON.stringify({
            commit_id: commitSha,
            body: summary,
            event: "COMMENT",
            comments: comments
        })
    })
    if(!response.ok){
        throw new Error(`The request ended with error code ${response.status}`);
    }
    const data = await response.json();
    return data;
}

