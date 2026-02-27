import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const generateTestToken = (userId: number = 1, role: string = 'USER'): string => {
  const secret = process.env.JWT_SECRET || 'test_secret_key';
  const payload = { id: userId, role };
  return jwt.sign(payload, secret, { expiresIn: '1h' });
};