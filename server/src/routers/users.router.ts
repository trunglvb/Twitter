import { loginController, logoutController, registerController } from '@/controllers/users.controller';
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
} from '@/middlewares/users.middleware';
import { wrapRequestHandler } from '@/utils/handlers';
import express from 'express';
const usersRouter = express.Router();

usersRouter.post('/login', loginValidator, wrapRequestHandler(loginController));
usersRouter.post('/register', registerValidator, wrapRequestHandler(registerController));

//logout (can headers: Beare accessToken, body: refreshToken)
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController));

//verify email when user click in the email
usersRouter.post('/verify-email', emailVerifyTokenValidator);

export default usersRouter;
