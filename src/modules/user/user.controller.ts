import type { Request, Response, NextFunction } from "express";
import { userService } from "../user/user.service";
import sendResponse from "../../utility/response";
import { AppError } from "../../middleware/globalErrorHandler";
import type { IUserQuery } from "./user.interface";

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await userService.getAllUsersFromDb(req.query as IUserQuery);
        sendResponse(res, {
            statusCode: 200,
            message: "Users retrieved successfully",
            data: users
        });
    } catch (error) {
        next(error);
    }
};

const getSingleUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userService.getSingleUserFromDb(req.params.id as string);
        
        if (!user) {
            throw new AppError("User not found", 404);
        }

        sendResponse(res, {
            statusCode: 200,
            message: "User retrieved successfully",
            data: user
        });
    } catch (error) {
        next(error);
    }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updatedUser = await userService.updateUserIntoDb(req.body, req.params.id as string);
        
        if (!updatedUser) {
            throw new AppError("User not found", 404);
        }

        sendResponse(res, {
            statusCode: 200,
            message: "User updated successfully",
            data: updatedUser
        });
    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await userService.deleteUserFromDb(req.params.id as string);
        
        if (result.rowCount === 0) {
            throw new AppError("User not found", 404);
        }

        sendResponse(res, {
            statusCode: 200,
            message: "User deleted successfully",
            data: null
        });
    } catch (error) {
        next(error);
    }
};

export const userController = {
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser
};