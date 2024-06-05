import express, { Request, Response } from "express";
import { configDotenv } from "dotenv";
import { sendMail } from "./lib/SendEmail";
import cors from "cors";

configDotenv({
    path: "./.env"
})
const app = express()
interface SendEmail {
    email: string[],
    url: string,
    college: string
}

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);
app.use(express.json())

app.post("/notify", async (req: Request, res: Response) => {
    try {
        const { email, url, college }: SendEmail = req.body;
        if (!email || !url || !college) {
            return res.status(400).json('Email, URL, and college are required.');
        }
        return res.status(200).json({ "message": "Done sending the notifications." })
    } catch (err) {
        return res.status(500).json({ "message": "There was an iissue sending the notification." })
    }
})

app.listen(3001, () => {
    console.log("Server up and running")
});
