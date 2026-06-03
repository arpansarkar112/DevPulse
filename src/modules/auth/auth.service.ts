import bcrypt from "bcrypt"; 
import jwt from "jsonwebtoken";
import { query } from "../../db";
import { AppError } from "../../middleware/globalErrorHandler";

const loginUserIntoDb = async (payload: {email: string, password: string}) => {
    const { email, password } = payload;
    
    const userResult = await query('SELECT * FROM users WHERE email = $1', [email]);
    const user = userResult.rows[0];  
    
    if (!user) {
        throw new AppError("Invalid credentials", 401); 
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
        throw new AppError("Invalid credentials", 401); 
    }

    const jwtPayload = {
        id: user.id,
        name: user.name,
        role: user.role
    };

    const accessToken = jwt.sign(
        jwtPayload, 
        process.env.JWT_SECRET || 'fallback_secret', 
        { expiresIn: '1d' }
    );

    return {
        token: accessToken, 
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            created_at: user.created_at, 
            updated_at: user.updated_at  
        }
    };
}

export const authService = {
    loginUserIntoDb
}