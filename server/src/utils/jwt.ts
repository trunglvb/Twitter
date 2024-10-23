import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
interface ISignToken {
  payload: string | Buffer | object;
  privateKey: string;
  options?: jwt.SignOptions;
}
interface IVerifyToken {
  token: string;
  privateKey: string;
  options?: jwt.SignOptions;
}
const signToken = ({ payload, privateKey, options = { algorithm: 'HS256' } }: ISignToken) => {
  return new Promise<string>((resolve, _reject) => {
    jwt.sign(payload, privateKey, options, (error, token) => {
      if (error) {
        throw error;
      }
      resolve(token as string);
    });
  });
};

const verifyToken = ({ token, privateKey }: IVerifyToken) => {
  return new Promise<JwtPayload>((resolve, _reject) => {
    jwt.verify(token, privateKey, (error, decoded) => {
      if (error) {
        throw error;
      }
      resolve(decoded as JwtPayload);
    });
  });
};

export { signToken, verifyToken };
