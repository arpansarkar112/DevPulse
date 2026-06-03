import type { NextFunction, Request, Response } from "express";
import { AppError } from "./globalErrorHandler";

export type ValidationIssue = {
    path: string;
    message: string;
};

type ValidatorFn = (req: Request) => ValidationIssue[];

const manualValidation = (validator: ValidatorFn) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const errors = validator(req);

        if (errors.length > 0) {
            return next(new AppError("Validation failed", 400, errors));
        }

        next();
    };
};

export default manualValidation;