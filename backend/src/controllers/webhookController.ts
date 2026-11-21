import type { Request, Response } from "express";
import { createHmac, timingSafeEqual } from "node:crypto";
import { generateInstallationAccessToken } from "../services/githubAuthService.js";
import { orchestrationWorkflow } from "../services/reviewService.js";
import { claimWebhookDelivery, updateWebhookDeliveryStatus } from "../repositories/webhookRepository.js";
import { publishFailureNotification } from "../services/githubNotificationService.js";

export async function handleGithubWebhook(req: Request, res: Response){
    const rawBody = (req as Request & { rawBody?: Buffer }).rawBody;

    if(!rawBody){
        res.status(400).send("Missing raw request body");
        return; 
    }

    const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;
    const signature = req.get('X-Hub-Signature-256');
    if (!webhookSecret) {
        console.error("Webhook secret is not configured");
        res.status(500).send("Internal Server Error");
        return;
    }

    if (!signature) {
        res.status(401).send("Missing webhook signature");
        return;
    }

    const expectedSignature = createHmac('sha256', webhookSecret).update(rawBody).digest('hex');
    
    const signatureFormatPattern = /^sha256=[a-fA-F0-9]{64}$/;
    const isSignPatternMatch = signatureFormatPattern.test(signature);
    if(!isSignPatternMatch){
        res.status(401).send("Invalid webhook signature");
        return;
    }
    const receivedSignature = signature.slice(7);
    
    const expectedSignatureBuffer = Buffer.from(expectedSignature, 'hex');
    const receivedSignatureBuffer = Buffer.from(receivedSignature, 'hex');

    if(expectedSignatureBuffer.length !== receivedSignatureBuffer.length){
        res.status(401).send('Unauthorized access. Signature lenght doesnt match');
        return;
    }

    const signatureComparison = timingSafeEqual(expectedSignatureBuffer, receivedSignatureBuffer);
    if(!signatureComparison){
        res.status(401).send('Unauthorized');
        return;
    }

    const eventType = req.get('X-Github-Event');
    if(eventType !== 'pull_request'){
        res.status(200).send(`${eventType} Event was ignored`);
        return;
    }

    const action = req.body.action;
    if(action !== 'opened' && action !== 'synchronize'){
        res.status(200).send(`${action} action was ignored`);
        return;
    }

    const repoOwner = req.body.repository?.owner?.login;
    const repoName = req.body.repository?.name;
    if((!repoOwner || typeof repoOwner !== 'string') || (!repoName || typeof repoName !== 'string')){
        res.status(400).send('Invalid Reposuitory');
        return;
    }

    const prId = req.body.pull_request?.id;
    const prNumber = req.body.pull_request?.number;
    const headSha = req.body.pull_request?.head?.sha;
    const installationId = req.body.installation?.id;

    
    if((!Number.isInteger(prId) || prId <= 0) || (!Number.isInteger(prNumber) || prNumber <= 0) || (!headSha || typeof headSha !== 'string') || (!Number.isInteger(installationId) || installationId <= 0)){
        res.status(400).send('Invalid webhook payload');
        return;
    }
    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/pulls/${prNumber}`;
    const deliveryId = req.get("X-GitHub-Delivery");
    if(!deliveryId){
        res.status(400).end();
        return;
    }
    let accessToken: string | undefined;
    try{
        const isClaimed = await claimWebhookDelivery(deliveryId, eventType);
        console.log("Webhook claimed:", deliveryId, isClaimed);
        if(!isClaimed){
            res.status(200).end();
            return;
        }
        accessToken = await generateInstallationAccessToken(installationId);
        await orchestrationWorkflow(url, accessToken);
        console.log("Orchestration completed:", deliveryId);
        await updateWebhookDeliveryStatus(deliveryId, 'completed');
        res.status(200).end();
    }catch(err){
        console.error("Webhook processing failed:", err);
        try{
            await updateWebhookDeliveryStatus(deliveryId, 'failed');
        }catch(err){
            console.error("Failed to update webhook delivery status:", err);
        }
        if(accessToken){
            try{
                await publishFailureNotification(url, accessToken, "PRism couldn't complete the automated review due to an internal processing error. Please try again later.");
            }catch(notificationError){
                console.error("Failed to publish failure notification:", notificationError);
            }
        }else{
            console.error("Skipping failure notification: GitHub access token unavailable.");
        }
        res.status(500).send('Internal Server Error');
    }
}