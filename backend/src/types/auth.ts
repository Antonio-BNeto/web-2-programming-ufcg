import { Request as ExpressRequest } from 'express';

export interface UserPayload {
    id: number;
    username: string;
    role: 'USER' | 'ADMIN'
    iat?: number;
    exp?: number;
}

export interface AuthenticatedRequest extends ExpressRequest {
  user: UserPayload;
}