import { loginController, registerController } from '@/controllers/users.controller';
import { loginValidator, registerValidator } from '@/middlewares/users.middleware';
import { wrapRequestHandler } from '@/utils/handlers';
import express from 'express';
const usersRouter = express.Router();

usersRouter.post('/login', loginValidator, loginController);
usersRouter.post('/register', registerValidator, wrapRequestHandler(registerController));

export default usersRouter;
