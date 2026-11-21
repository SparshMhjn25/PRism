import { readFile } from "node:fs/promises";
import jwt from "jsonwebtoken";

export async function generateInstallationAccessToken(installationId: number){
    const private_key_path = process.env.GITHUB_PRIVATE_KEY_PATH;
    if(!private_key_path){
        throw new Error('GITHUB_PRIVATE_KEY_PATH is not configured');
    }

    const appId = Number(process.env.GITHUB_APP_ID);
    if(!Number.isInteger(appId) || appId <= 0) {
        throw new Error("GITHUB_APP_ID is invalid");
    }

    if(!Number.isInteger(installationId) || installationId <= 0) {
        throw new Error("Invalid installation ID");
    }

    const pvt_key = await readFile(private_key_path, 'utf8');
    const currentTime = Date.now(); 

    const claims = {
        iat: Math.floor(currentTime / 1000),
        exp: Math.floor(currentTime / 1000) + 9 * 60,
        iss: appId
    }

    const jwt_token = jwt.sign(claims, pvt_key, {algorithm: "RS256"});

    const response = await fetch(
        `https://api.github.com/app/installations/${installationId}/access_tokens`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${jwt_token}`,
                Accept: "application/vnd.github+json",
                "X-GitHub-Api-Version": "2022-11-28"
            }
        }
    );
    if(!response.ok) {
        throw new Error(`GitHub API request failed: ${response.status}`);
    }
    const data: unknown = await response.json();
    if (typeof data !== 'object' || data === null || !('token' in data)) {
        throw new Error('Invalid GitHub token response');
    }

    if(typeof(data.token) !== 'string' || data.token.length === 0){
        throw new Error('Failed to properly fetch the Installation Access Token');
    }

    return data.token;
}
