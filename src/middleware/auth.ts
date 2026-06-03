import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { query } from "../db";
import { AppError } from "./globalErrorHandler"; 
import type { JwtPayload as AppJwtPayload } from "../types";

type Role = 'contributor' | 'maintainer';

const auth = (...roles: Role[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization;
            
            if (!authHeader) {
                throw new AppError("Unauthorized access. Token is missing.", 401);
            }

            const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

            const decoded = jwt.verify(
                token as string, 
                process.env.JWT_SECRET as string || 'fallback_secret'
            ) as AppJwtPayload;

            const userData = await query(
                'SELECT id, name, role FROM users WHERE id = $1', 
                [decoded.id]
            );
            const user = userData.rows[0];

            if (!user) {
                throw new AppError("User not found.", 404);
            }

            if (roles.length > 0 && !roles.includes(user.role)) {
                throw new AppError("Forbidden! You do not have required permissions.", 403);
            }

            req.user = user;

            next();
        } catch (error) {
            next(error); 
        }
    };
};

export default auth;