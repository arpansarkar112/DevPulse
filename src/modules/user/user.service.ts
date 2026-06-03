import { query } from "../../db";
import type { IUser } from "./user.interface";
import bcrypt from "bcrypt";
import { AppError } from "../../middleware/globalErrorHandler";

const createUserIntoDb = async (payload: IUser) => {
    const { name, email, password, role } = payload;

    const existingUser = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
        throw new AppError("Email is already in use", 409); 
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const result = await query(
        `INSERT INTO users (name, email, password, role) 
         VALUES ($1, $2, $3, $4) 
         RETURNING id, name, email, role, created_at, updated_at`,
        [name, email, hashedPassword, role ?? 'contributor']
    );

    return result.rows[0];
};

export const userService = {
    createUserIntoDb
};