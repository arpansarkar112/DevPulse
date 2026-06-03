import type { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
    statusCode: number;
    errors: unknown;

    constructor(message: string, statusCode: number, errors: unknown = null) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        Error.captureStackTrace(this, this.constructor);
    }
}
const globalErrorHandler = (
    err: Error | AppError, 
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    const statusCode = err instanceof AppError ? err.statusCode : 500;
    const errorDetails = err instanceof AppError && err.errors ? err.errors : err;

    res.status(statusCode).json({
        success: false,
        message: err.message || "Something went wrong",
        errors: errorDetails
    });
};

export default globalErrorHandler;