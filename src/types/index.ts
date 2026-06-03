import type { Request } from 'express';

export const USER_ROLE = {
    contributor: 'contributor',
    maintainer: 'maintainer'
} as const;

export type Role = keyof typeof USER_ROLE;


export interface JwtPayload {
    id: number;
    name: string;
    role: Role;
}

export interface AuthRequest extends Request {
    user?: JwtPayload;
}