import { ParamsDictionary } from 'express-serve-static-core';
import userService from '@/services/user.services';
import { NextFunction, Request, Response } from 'express';
import { IRegisterRequestBody } from '@/models/requests/user.request';
import User from '@/models/schemas/users.schema';

type ILoginBody = Pick<IRegisterRequestBody, 'email' | 'password'>;

const loginController = async (req: Request<ParamsDictionary, any, ILoginBody>, res: Response, _next: NextFunction) => {
  const { user } = req;
  const result = await userService.login(user as User);
  return res.status(200).json({
    message: 'Login success',
    result: result
  });
};

const registerController = async (
  req: Request<ParamsDictionary, any, IRegisterRequestBody>,
  res: Response,
  _next: NextFunction
) => {
  const { body } = req;
  const result = await userService.register(body);
  return res.status(200).json({
    message: 'Register success',
    result: result
  });
};

export { loginController, registerController };
