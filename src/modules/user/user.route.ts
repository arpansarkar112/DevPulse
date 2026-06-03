import { Router } from "express";
import { userController } from "./user.controller";
import manualValidation from "../../middleware/manualValidation";
import { userValidation } from "./user.validation";

const router = Router();

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getSingleUser);
router.put('/:id', manualValidation(userValidation.validateUserUpdateBody), userController.updateUser);
router.delete('/:id', userController.deleteUser);

export const userRoute = router;
