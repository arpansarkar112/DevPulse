import { query } from "../../db";
import type { IUser, IUserQuery } from "./user.interface";
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

const getAllUsersFromDb = async (queryPayload: IUserQuery) => {
    const sort = queryPayload.sort ?? 'newest';
    const role = queryPayload.role;
    const page = parseInt(queryPayload.page as string) || 1;
    const limit = parseInt(queryPayload.limit as string) || 10;
    const offset = (page - 1) * limit;

    if (sort && !['newest', 'oldest'].includes(sort)) {
        throw new AppError("Invalid sort value. Use 'newest' or 'oldest'.", 400);
    }

    if (role && !['contributor', 'maintainer'].includes(role)) {
        throw new AppError("Invalid role value. Use 'contributor' or 'maintainer'.", 400);
    }

    let sqlString = 'SELECT id, name, email, role, created_at, updated_at FROM users WHERE 1=1';
    const sqlValues: Array<string | number | boolean | null | Date> = [];

    if (role) {
        sqlValues.push(role);
        sqlString += ` AND role = $${sqlValues.length}`;
    }

    sqlString += sort === 'oldest'
        ? ' ORDER BY created_at ASC'
        : ' ORDER BY created_at DESC';

    sqlValues.push(limit);
    sqlString += ` LIMIT $${sqlValues.length}`;

    sqlValues.push(offset);
    sqlString += ` OFFSET $${sqlValues.length}`;

    const result = await query(sqlString, sqlValues);
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