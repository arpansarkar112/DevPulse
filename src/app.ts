import express, { type Application, type Request, type Response } from "express";
import cors from "cors";
import globalErrorHandler from "./middleware/globalErrorHandler";
import { issuesRoute } from "./modules/issues/issues.route";
import { userRoute } from "./modules/user/user.route";


const app: Application = express();

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cors()); 

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "DevPulse API Server is running",
        author: "Arpan",
    });
});

app.use('/api/issues', issuesRoute);
app.use('/api/register', userRoute);

app.use(globalErrorHandler);

export default app;