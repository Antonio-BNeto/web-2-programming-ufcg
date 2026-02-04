import * as express from "express";
import { verifyToken } from "../utils/auth";
import { UserPayload } from "../types/auth";

export function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes?: string[]
): Promise<UserPayload> {
  if (securityName === "jwt") {
    const token = request.headers["authorization"]?.split(" ")[1];

    return new Promise((resolve, reject) => {
      if (!token) {
        return reject(new Error("No token provided"));
      }

      try {
        const decoded = verifyToken(token) as UserPayload;
        request.user = decoded;
        resolve(decoded);
      } catch (err) {
        reject(new Error("Invalid token"));
      }
    });
  }
  return Promise.reject(new Error("Security name not supported"));
}