import {
  emailVerifyTokenController,
  forgotPasswordController,
  getProfileController,
  loginController,
  logoutController,
  registerController,
  resendEmailVerifyController,
  resetPasswordController,
  verifyForgotPasswordTokenController
} from '@/controllers/users.controller';
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  forgotPasswordEmailValidator,
  forgotPasswordTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetForgotPasswordValidator,
  resetPasswordValidator
} from '@/middlewares/users.middleware';
import { wrapRequestHandler } from '@/utils/handlers';
import express from 'express';
const usersRouter = express.Router();

usersRouter.post('/login', loginValidator, wrapRequestHandler(loginController));
usersRouter.post('/register', registerValidator, wrapRequestHandler(registerController));

//logout (can headers: Beare accessToken, body: refreshToken)
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController));

//verify email when user click in the email
usersRouter.post('/verify-email', emailVerifyTokenValidator, wrapRequestHandler(emailVerifyTokenController));

//resend email verify token
//need login first to can resend email with authorization header
usersRouter.post('/resend-email-verify-token', accessTokenValidator, wrapRequestHandler(resendEmailVerifyController));

//forgot hashPassword
//B1: check email valid to update forgot_password_token

usersRouter.post('/forgot-password', forgotPasswordEmailValidator, wrapRequestHandler(forgotPasswordController));

//verify forgotpassword token
usersRouter.post(
  '/verify-forgot-password',
  forgotPasswordTokenValidator,
  wrapRequestHandler(verifyForgotPasswordTokenController)
);

//reset password if forgot password
usersRouter.post('/reset-forgot-password', resetForgotPasswordValidator, wrapRequestHandler(resetPasswordController));

//reset password if has logined
usersRouter.post(
  '/reset-password',
  accessTokenValidator,
  resetPasswordValidator,
  wrapRequestHandler(resetPasswordController)
);

//get profile
usersRouter.get('/me', accessTokenValidator, wrapRequestHandler(getProfileController));

export default usersRouter;
