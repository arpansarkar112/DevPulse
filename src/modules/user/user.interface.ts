export interface IUser {
    name: string;
    email: string;
    password: string;
    role?: 'contributor' | 'maintainer';
}

export interface IUserQuery {
    sort?: 'newest' | 'oldest';
    role?: 'contributor' | 'maintainer';
    page?: string;
    limit?: string;
}