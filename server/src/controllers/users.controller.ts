import { ParamsDictionary } from 'express-serve-static-core';
import userService from '@/services/user.services';
import { NextFunction, Request, Response } from 'express';
import { IRegisterRequestBody } from '@/models/requests/user.request';
import User from '@/models/schemas/users.schema';
import { HttpStatusCode } from '@/constants/enums';
import databaseService from '@/services/database.services';
import { ObjectId } from 'mongodb';
import { ErrorWithStatus } from '@/utils/errors';

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

const emailVerifyTokenController = async (req: Request, res: Response, _next: NextFunction) => {
  const { user_id } = req.decode_email_verify_token!;
  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) });
  if (!user) {
    throw new ErrorWithStatus({
      status: HttpStatusCode.NotFound,
      message: 'User not found'
    });
  }
  //neu verify roi thi ko bao loi ma tra ve thong bao da verify
  if (user?.email_verify_token === '') {
    res.status(HttpStatusCode.Ok).json({
      message: 'Email already verified'
    });
  }
};

export { loginController, registerController, logoutController, emailVerifyTokenController };
