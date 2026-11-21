import { randomBytes } from "node:crypto";
import type { Request, Response } from "express";

export async function authController(req: Request, res: Response){
    const client_id = process.env.GITHUB_CLIENT_ID;
    const github_callback_url = process.env.GITHUB_CALLBACK_URL;

    if (!client_id) {
        throw new Error("GITHUB_CLIENT_ID is not configured");
    }
    if (!github_callback_url) {
        throw new Error("GITHUB_CALLBACK_URL is not configured");
    }
    req.session.authState = randomBytes(32).toString('hex');
    const githubURL = new URL("https://github.com/login/oauth/authorize");
    githubURL.searchParams.set("client_id", client_id);
    githubURL.searchParams.set("redirect_uri", github_callback_url);
    githubURL.searchParams.set("scope", "read:user");
    githubURL.searchParams.set("state", req.session.authState);

    req.session.save((err)=>{
        if(err){
            console.error(err);
            return res.status(500).send("Redirection Failed...")
        
        }else{
            res.redirect(githubURL.toString());
        }
    })

}

export async function githubCallbackController(req: Request, res: Response){
    const code = req.query.code;
    const received_state = req.query.state;

    if(!code || typeof code !== "string"){
        return res.status(400).send("400 Bad Request");
    }

    if(!received_state || typeof received_state !== "string"){
        return res.status(400).send("400 Bad Request");
    }

    if(received_state !== req.session.authState){
        return res.status(403).send("Invalid OAuth state");
    }
    delete req.session.authState;

    req.session.save(async (err)=>{
        if(err){
            return res.status(500).send("Failed to invalidate OAuth state");
        }
        try{
            const response = await fetch("https://github.com/login/oauth/access_token", {
                method: 'POST',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    client_id: process.env.GITHUB_CLIENT_ID,
                    client_secret: process.env.GITHUB_CLIENT_SECRET,
                    code: code,
                    redirect_uri: process.env.GITHUB_CALLBACK_URL
                })
            })
            if(!response.ok){
                return res.status(502).send("GitHub token exchange failed");
            }
            const data = await response.json();
            if(!data.access_token || typeof data.access_token !== "string"){
                return res.status(502).send('GitHub did not return a valid access token')
            }
            return res.status(200).send("GitHub token exchange successful");
        }catch(err){
            return res.status(502).send("Unable to communicate with GitHub");
        }
    });
}