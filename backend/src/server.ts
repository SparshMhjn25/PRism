import cors from 'cors';
import session from 'express-session';
import express from 'express'; 
import router from './routers/index.js';
import type { Request, Response } from 'express';
import webhookRouter from './routers/webhookRouter.js';
import authRouter from './routers/authRouter.js';

const app = express();
app.use(cors({
    origin: "http://localhost:5173"
}));
const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
    throw new Error("SESSION_SECRET is not configured");
}
app.set("trust proxy", 1);
app.use(session({secret: sessionSecret, resave: false, saveUninitialized: false, cookie: { httpOnly: true, secure: true, sameSite: "lax", maxAge: 24*60*60*1000}}));
type WebhookRequest = Request & {
    rawBody: Buffer;
}

app.use(express.json({
    verify: (req: Request, res: Response, buf) =>{
        (req as WebhookRequest).rawBody = buf;
    },
}));
app.use(router);
app.use('/webhooks', webhookRouter);
app.use('/auth', authRouter);
app.get("/", (req, res) => {
    res.send("PRism backend is running");
});


app.listen(process.env.PORT, ()=> console.log("Server started..."));