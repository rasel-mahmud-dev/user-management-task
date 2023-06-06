import session from 'express-session';
import {Request} from "express";

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
        isVerified: boolean;
    };
}

export type Permission = {
    read: boolean
    create: boolean
    update: boolean
    delete: boolean
}



export interface RequestWithCSRF extends Request {
    csrfToken?: ()=> string
}
