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

const getAllUsersFromDb = async () => {
    const result = await query(
        'SELECT id, name, email, role, created_at, updated_at FROM users'
    );
    return result.rows;
};

const getSingleUserFromDb = async (id: string) => {
    const result = await query(
        'SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = $1',
        [id]
    );
    return result.rows[0];
};

const updateUserIntoDb = async (payload: Partial<IUser>, id: string) => {
    const { name, role } = payload;
    

    const result = await query(
        `UPDATE users 
         SET name = COALESCE($1, name), 
             role = COALESCE($2, role),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $3 
         RETURNING id, name, email, role, created_at, updated_at`, 
        [name ?? null, role ?? null, id]
    );
    
    return result.rows[0];
};

const deleteUserFromDb = async (id: string) => {
    const result = await query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
    return result;
};

export const userService = {
    createUserIntoDb, 
    getAllUsersFromDb,
    getSingleUserFromDb,
    updateUserIntoDb,
    deleteUserFromDb
};