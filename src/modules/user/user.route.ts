import { Router } from "express";
import { userController } from "./user.controller";
import manualValidation from "../../middleware/manualValidation";
import { userValidation } from "./user.validation";
import auth from '../../middleware/auth';

const router = Router();

router.get('/', auth('maintainer'), userController.getAllUsers);
router.get('/:id', auth('maintainer'), userController.getSingleUser);
router.put('/:id', auth('maintainer', 'contributor'), manualValidation(userValidation.validateUserUpdateBody), userController.updateUser);
router.delete('/:id', auth('maintainer'), userController.deleteUser);

export const userRoute = router;
