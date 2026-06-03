import type { Request, Response, NextFunction } from "express";
import { issuesService } from "./issues.service";
import sendResponse from "../../utility/response";
import { AppError } from "../../middleware/globalErrorHandler";

const createIssue = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reporter_id = req.user?.id;

        const secureIssuePayload = {
            ...req.body,
            reporter_id: reporter_id 
        };

        const result = await issuesService.createIssueIntoDb(secureIssuePayload);

        sendResponse(res, {
            statusCode: 201,
            message: "Issue created successfully",
            data: result
        });     
    }
    catch (error) {
        next(error);
    }
};

const getAllIssues = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await issuesService.getAllIssuesFromDb();
        
        sendResponse(res, {
            statusCode: 200,
            message: "Issues retrieved successfully",
            data: result
        });
    } catch (error) {
        next(error); 
    }
};

const getSingleIssue = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const result = await issuesService.getSingleIssueFromDb(id as string);
        
        if (!result) {
            throw new AppError("Issue not found", 404);
        }
        
        sendResponse(res, {
            statusCode: 200,
            message: "Issue retrieved successfully",
            data: result
        });
    } catch (error) {
        next(error); 
    }
};

export const issuesController = {
    createIssue,
    getAllIssues,
    getSingleIssue
};