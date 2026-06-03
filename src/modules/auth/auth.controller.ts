import type { Request, Response, NextFunction } from "express";
import { authService } from "./auth.service";
import { userService } from "../user/user.service"; 
import sendResponse from "../../utility/response";

const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await userService.createUserIntoDb(req.body);
        sendResponse(res, {
            statusCode: 201,
            message: "User registered successfully",
            data: result
        });
    } catch (error) {
        next(error); 
    }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await authService.loginUserIntoDb(req.body);

        sendResponse(res, {
            statusCode: 200,
            message: "User logged in successfully",
            data: result
        });
    } catch (error) {
        next(error); 
    }
}

export const authController = {
    register,
    login 
}