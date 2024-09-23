import { loginController } from '@/controllers/users.controller';
import { loginValidator } from '@/middlewares/users.middleware';
import express from 'express';
const usersRouter = express.Router();

usersRouter.post('/login', loginValidator, loginController);

export default usersRouter;
// mongodb+srv://levubaotrung0311:GReZoR8XP6iMur72@twitter.6nmgf.mongodb.net/
