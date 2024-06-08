import { configDotenv } from "dotenv";
import { sendMail } from "./lib/SendEmail";
import { createClient } from "redis";

configDotenv({
    path: "./.env"
})


async function startWorker() {
    try {
        const client = createClient()
        client.on('error', (err) => { console.log('Redis Client Error', err); process.exit(0) });
        await client.connect();
        console.log("Worker connected to Redis.");
        while (true) {
            try {
                const data = await client.brPop("notify", 0);
                const jsonData = JSON.parse(data?.element || "")
                console.log(jsonData)
                await sendMail(jsonData.email, jsonData.url, jsonData.college)
            } catch (error) {
                console.error("Error sending the notifications", error);
            }
        }
    } catch (error) {
        console.error("Failed to connect to Redis", error);
    }
}

startWorker();
