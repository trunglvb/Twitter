import {
  emailVerifyTokenController,
  followedUserController,
  forgotPasswordController,
  getProfileByUsernameController,
  getProfileController,
  loginController,
  logoutController,
  oauthController,
  refreshTokenController,
  registerController,
  resendEmailVerifyController,
  resetPasswordController,
  unfollowUserController,
  updateProfile,
  verifyForgotPasswordTokenController
} from '@/controllers/users.controllers';
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  followValidator,
  forgotPasswordEmailValidator,
  forgotPasswordTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetForgotPasswordValidator,
  resetPasswordValidator,
  unfollowValidator,
  updateMeValidator,
  verifyUserValidator
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

usersRouter.post(
  '/forgot-password',
  accessTokenValidator,
  forgotPasswordEmailValidator,
  wrapRequestHandler(forgotPasswordController)
);

//verify forgotpassword token
usersRouter.post(
  '/verify-forgot-password',
  accessTokenValidator,
  forgotPasswordTokenValidator,
  wrapRequestHandler(verifyForgotPasswordTokenController)
);

//reset password if forgot password
usersRouter.post('/reset-forgot-password', accessTokenValidator, wrapRequestHandler(resetPasswordController));

//reset password if has logined
usersRouter.post(
  '/reset-password',
  accessTokenValidator,
  resetPasswordValidator,
  wrapRequestHandler(resetPasswordController)
);

//get profile
usersRouter.get('/me', accessTokenValidator, wrapRequestHandler(getProfileController));

//get profile by username
usersRouter.post('/profile', wrapRequestHandler(getProfileByUsernameController));

//update profile use patch
//khi dung patch, gui phan nao vao body thi se cap nhat phan do, khong can gui tat ca cac truong nhu put

usersRouter.patch(
  '/update-me',
  accessTokenValidator,
  verifyUserValidator,
  updateMeValidator,
  wrapRequestHandler(updateProfile)
);

//follower
usersRouter.post(
  '/follow',
  accessTokenValidator,
  verifyUserValidator,
  followValidator,
  wrapRequestHandler(followedUserController)
);

//unfollow user
usersRouter.delete(
  '/follow/:user_id',
  accessTokenValidator,
  verifyUserValidator,
  unfollowValidator,
  wrapRequestHandler(unfollowUserController)
);

//login google
usersRouter.get('/oauth/google', wrapRequestHandler(oauthController));

//refresh_token
usersRouter.post('/refresh-token', refreshTokenValidator, wrapRequestHandler(refreshTokenController));

export default usersRouter;
