import { Router } from "express";
import { userController } from "./user.controller";

const router = Router();

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getSingleUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

export const userRoute = router;
