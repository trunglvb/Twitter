import { createHash } from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

export const sha256 = (content: string) => {
  return createHash('sha3-256').update(content).digest('hex');
};

export const hashPassword = (value: string) => sha256(value + process.env.PASSWORD_KEY_SECRET);
