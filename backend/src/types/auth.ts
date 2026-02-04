import { Request as ExpressRequest } from 'express';

export interface UserPayload {
    id: number;
    username: string;
    iat?: number;
    exp?: number;
}

export interface AuthenticatedRequest extends ExpressRequest {
  user: UserPayload;
}