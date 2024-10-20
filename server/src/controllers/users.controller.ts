import { ParamsDictionary } from 'express-serve-static-core';
import userService from '@/services/user.services';
import { NextFunction, Request, Response } from 'express';
import { IRegisterRequestBody } from '@/models/requests/user.request';
import User from '@/models/schemas/users.schema';
import { HttpStatusCode } from '@/constants/enums';
import databaseService from '@/services/database.services';

type ILoginBody = Pick<IRegisterRequestBody, 'email' | 'password'>;

const loginController = async (req: Request<ParamsDictionary, any, ILoginBody>, res: Response, _next: NextFunction) => {
  const { user } = req;
  const result = await userService.login(user as User);
  return res.status(HttpStatusCode.Ok).json({
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
  return res.status(HttpStatusCode.Ok).json({
    message: 'Register success',
    result: result
  });
};

const logoutController = async (
  req: Request<ParamsDictionary, any, { refresh_token: string }>,
  res: Response,
  _next: NextFunction
) => {
  const { refresh_token } = req.body;
  await userService.logout(refresh_token);
  return res.status(HttpStatusCode.Ok).json({
    message: 'Logout success'
  });
};

export { loginController, registerController, logoutController };
