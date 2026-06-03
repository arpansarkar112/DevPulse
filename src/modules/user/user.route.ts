import { Router } from "express";
import type { Request, Response } from "express";

const router = Router();

router.post('/register', (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "The register route is successfully connected!",
        receivedData: req.body 
    });
});

export const userRoute = router;