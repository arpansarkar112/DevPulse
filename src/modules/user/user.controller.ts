import type { Request, Response, NextFunction } from "express";
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

export const authController = {
    register
};