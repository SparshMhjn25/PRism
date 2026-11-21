import OpenAI from "openai";
import type { Finding, ReviewResult } from "../types/finding.js";

export const modelName = "poolside/laguna-xs-2.1";

function isFinding(value: unknown): value is Finding{
    return typeof value === "object" && value !== null;
}

function isReviewResult(value: unknown): value is ReviewResult{
    return (
        typeof value === "object" &&
        value !== null &&
        "findings" in value &&
        "summary" in value &&
        typeof value.summary === 'string' &&
        Array.isArray(value.findings) &&
        value.findings.every(isFinding)
    );
}

export async function llmRequest(diff: string){
    const client = new OpenAI({
        apiKey: process.env.NVIDIA_API_KEY,
        baseURL: 'https://integrate.api.nvidia.com/v1'
    });
    
    const response = await client.chat.completions.create({
        model: modelName,
        messages: [
            {role: 'system', content: `You are an experienced code reviewer. Analyze the provided pull request diff and identify actionable issues involving bugs, security vulnerabilities, performance, architecture, and code style.

            Review only issues supported by evidence in the diff. Prioritize problems introduced by the changes. Do not report speculative issues as definite problems, and avoid nitpicks that do not provide meaningful value.

            Return a valid JSON object with the following structure:
            {
                "summary": "Found one potential null-reference bug in the request handler.",
                "findings": [
                    {
                        "severity": "high",
                        "category": "bug",
                        "file_path": "src/example.ts",
                        "line_number": 10,
                        "message": "Explain the issue and why it matters.",
                        "suggestion": "Describe a practical way to fix the issue."
                    }
                ]
            }

            Requirements:
            - The top-level object must contain a "summary" string and a "findings" array.
            - The summary must be exactly one concise sentence describing the overall review outcome and the most important findings.
            - If no actionable issues are found, return an empty findings array and a summary stating that no actionable issues were found in the supplied diff.
            - Each finding must contain exactly these fields: severity, category, file_path, line_number, message, and suggestion.
            - severity must be one of: critical, high, medium, low.
            - category must be one of: bug, security, performance, architecture, style.
            - file_path must identify a file present in the supplied diff.
            - line_number must be an integer identifying a relevant line in the diff. Do not invent line numbers or file paths. If a reliable location cannot be established, omit the finding.
            - message must clearly explain the issue, its impact, and the evidence supporting it.
            - suggestion must describe a practical fix. If no specific fix can be recommended confidently, provide a concise explanation of what should be investigated.
            - Return an empty findings array if no actionable issues are found.
            - Return JSON only. Do not include Markdown fences, comments, or explanatory text outside the JSON object.`
            },
            {role: 'user', content: diff}
        ]
    });
    const raw_response = response.choices[0]?.message.content;

    if (!raw_response) {
        throw new Error("Response Generation Failed");
    }

    const cleaned_response = raw_response
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/, "")
        .trim();

    let refined_response: unknown;

    try {
        refined_response = JSON.parse(cleaned_response);
    } catch {
        throw new Error("LLM returned invalid JSON");
    }

    if (!isReviewResult(refined_response)) {
        throw new Error("Invalid review response structure");
    }

    return refined_response;
}

