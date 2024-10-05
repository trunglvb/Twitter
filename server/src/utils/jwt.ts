import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
interface ISignToken {
  payload: string | Buffer | object;
  privateKey?: string;
  options?: jwt.SignOptions;
}
const signToken = ({
  payload,
  privateKey = process.env.JWT_SECRET as string,
  options = { algorithm: 'HS256' }
}: ISignToken) => {
  return new Promise<string>((resolve, _reject) => {
    jwt.sign(payload, privateKey, options, (error, token) => {
      if (error) {
        throw error;
      }
      resolve(token as string);
    });
  });
};

export { signToken };
