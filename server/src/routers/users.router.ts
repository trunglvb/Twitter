import { loginController, registerController } from '@/controllers/users.controller';
import { loginValidator, registerValidator } from '@/middlewares/users.middleware';
import validate from '@/utils/validation';
import express from 'express';
const usersRouter = express.Router();

usersRouter.post('/login', loginValidator, loginController);
usersRouter.post('/register', registerValidator, registerController);

export default usersRouter;
