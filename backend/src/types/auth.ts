import { Request as ExpressRequest } from 'express';

export interface UserPayload {
    id: number;
    username: string;
    name: string;
    email: string;
    role: 'USER' | 'ADMIN';
    iat?: number;
    exp?: number;
}

export interface AuthenticatedRequest extends ExpressRequest {
  user: UserPayload;
}