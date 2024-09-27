import { loginController, registerController } from '@/controllers/users.controller';
import { loginValidator } from '@/middlewares/users.middleware';
import express from 'express';
const usersRouter = express.Router();

usersRouter.post('/login', loginValidator, loginController);
usersRouter.post('/register', registerController);

export default usersRouter;
