import jwt from 'jsonwebtoken';

const signToken = (payload: any, privateKey: string, options: jwt.SignOptions) => {
  return new Promise<string>((resolve, _reject) => {
    jwt.sign(payload, privateKey, options, (error, token) => {
      if (error) {
        throw error;
      }
      resolve(token as string);
    });
  });
};
