import { fetchPullRequestDiff } from "./services/githubPullRequestService.js";

const pr_diff = await fetchPullRequestDiff();
console.log(pr_diff);