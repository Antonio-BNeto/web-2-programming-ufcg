import * as express from "express";
import { verifyToken } from "../utils/auth";
import { UserPayload } from "../types/auth";
import { AppError } from "../errors/AppError";

export function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes?: string[]
): Promise<UserPayload> {
  if (securityName === "jwt") {
    const token = request.headers["authorization"]?.split(" ")[1];

    return new Promise((resolve, reject) => {
      if (!token) {
        return reject(new AppError("No token provided", 401));
      }

      try {
        const decoded = verifyToken(token) as UserPayload;

        if (scopes && scopes.length > 0) {
          const hasAccess = scopes.includes(decoded.role);
          if (!hasAccess) {
            return reject(new AppError("Insufficient permissions", 403));
          }
        }

        (request as any).user = decoded;
        resolve(decoded);
      } catch (err) {
        reject(new AppError("Invalid token", 401));
      }
    });
  }

  return Promise.reject(new AppError("Security name not supported", 401));
}