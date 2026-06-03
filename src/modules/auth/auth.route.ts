import { Router } from "express";
import { authController } from "./auth.controller";
import manualValidation from "../../middleware/manualValidation";
import { authValidation } from "./auth.validation";

const router = Router();

router.post('/signup', manualValidation(authValidation.validateRegisterBody), authController.register);
router.post('/login', manualValidation(authValidation.validateLoginBody), authController.login);

export const authRoute = router;