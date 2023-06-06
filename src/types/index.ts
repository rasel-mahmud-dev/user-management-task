import session from 'express-session';

export enum Role {
    USER = "USER",
    ADMIN = "ADMIN",
    SUPPORT = "SUPPORT"
}


// Custom session type
export interface CustomSession extends session.Session {
    user: {
        id: number;
        email: string;
        role: Role;
    };
}

export type Permission = {
    read: boolean
    create: boolean
    update: boolean
    delete: boolean
}
