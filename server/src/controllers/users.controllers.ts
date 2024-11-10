import { ParamsDictionary } from 'express-serve-static-core';
import userService from '@/services/user.services';
import { NextFunction, Request, Response } from 'express';
import {
  IFollowedUserBody,
  IRegisterRequestBody,
  IUnfollowUserParams,
  IUpdateMeBody
} from '@/models/requests/user.request';
import User from '@/models/schemas/users.schema';
import { EUserVerifyStatus, HttpStatusCode } from '@/constants/enums';
import databaseService from '@/services/database.services';
import { ObjectId } from 'mongodb';
import { ErrorWithStatus } from '@/utils/errors';
import { pick } from 'lodash';

type ILoginBody = Pick<IRegisterRequestBody, 'email' | 'password'>;
type IForgotPasswordBody = {
  email: string;
};
type IResetPasswordBody = {
  forgot_password_token: string;
  password: string;
  new_password: string;
  confirm_new_password: string;
};

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
    return res.status(HttpStatusCode.Ok).json({
      message: 'Email already verified'
    });
  }

  const result = await userService.verifyEmail(user_id);
  res.status(HttpStatusCode.Ok).json({
    message: 'Email verified',
    result
  });
};

export const resendEmailVerifyController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decode_access_token!;
  const user = await databaseService.users.findOne({
    _id: new ObjectId(user_id)
  });
  if (!user) {
    throw new ErrorWithStatus({
      status: HttpStatusCode.NotFound,
      message: 'User not found'
    });
  }
  if (user?.verify === EUserVerifyStatus.Verified) {
    return res.json({
      message: 'Email already verified'
    });
  }
  await userService.resendEmailVerify(user_id);
  return res.status(HttpStatusCode.Ok).json({
    message: 'Resend email verify success'
  });
};

const forgotPasswordController = async (
  req: Request<ParamsDictionary, any, IForgotPasswordBody>,
  res: Response,
  _next: NextFunction
) => {
  const { user } = req;
  await userService.updateForgotPasswordToken(user as User);
  return res.status(HttpStatusCode.Ok).json({
    message: 'Forgot password token updated'
  });
};

const verifyForgotPasswordTokenController = async (
  _req: Request<ParamsDictionary, any, { forgot_password_token: string }>,
  res: Response,
  _next: NextFunction
) => {
  return res.status(HttpStatusCode.Ok).json({
    message: 'Forgot password token verified'
  });
};

const resetPasswordController = async (
  req: Request<ParamsDictionary, any, IResetPasswordBody>,
  res: Response,
  _next: NextFunction
) => {
  const { user_id } = req.decode_forgot_password_token!;
  const result = await userService.resetPassword(user_id, req.body.new_password);
  return res.status(HttpStatusCode.Ok).json({
    message: 'New password has been updated',
    result
  });
};

const getProfileController = async (req: Request, res: Response, _next: NextFunction) => {
  const { user_id } = req.decode_access_token!;
  const result = await userService.getProfile(user_id);
  return res.status(HttpStatusCode.Ok).json({
    message: 'Get user infomation success',
    user: result
  });
};

const updateProfile = async (
  req: Request<ParamsDictionary, any, IUpdateMeBody>,
  res: Response,
  _next: NextFunction
) => {
  const { body, decode_access_token } = req;
  const result = await userService.updateMe({
    body: pick(body, ['date_of_birth', 'name', 'bio', 'location', 'website', 'username', 'avatar', 'cover_photo']),
    user_id: decode_access_token?.user_id!
  });
  return res.status(HttpStatusCode.Ok).json({
    message: 'Update user success',
    user: result
  });
};

const followedUserController = async (
  req: Request<ParamsDictionary, any, IFollowedUserBody>,
  res: Response,
  _next: NextFunction
) => {
  const { user_id } = req.decode_access_token!;
  const { followed_user_id } = req.body;

  const result = await userService.follower({
    user_id: user_id,
    followed_user_id: followed_user_id
  });
  return res.status(200).json({
    message: result.message
  });
};

const unfollowUserController = async (req: Request, res: Response, _next: NextFunction) => {
  const { user_id } = req.decode_access_token!;
  const { user_id: followed_user_id } = req.params as IUnfollowUserParams;

  const result = await userService.unfollow({
    user_id: user_id,
    followed_user_id: followed_user_id
  });
  return res.status(200).json({
    message: result.message
  });
};

export {
  loginController,
  registerController,
  logoutController,
  emailVerifyTokenController,
  forgotPasswordController,
  verifyForgotPasswordTokenController,
  resetPasswordController,
  getProfileController,
  updateProfile,
  followedUserController,
  unfollowUserController
};
