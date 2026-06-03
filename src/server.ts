import app from "./app";
import config from "./config";
import { initDB } from "./db";

await initDB();

if (process.env.VERCEL !== "1") {
    app.listen(config.port, () => {
        console.log(`Example app listening on port ${config.port}`);
    });
}

export default app;