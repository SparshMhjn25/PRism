import { llmRequest } from "./services/llmService.js";
import { fetchPullRequestDiff } from "./services/githubPullRequestService.js";

const diff = await fetchPullRequestDiff();
const result = await llmRequest(diff);
console.log(result);