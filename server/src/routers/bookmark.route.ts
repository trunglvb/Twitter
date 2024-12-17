import { accessTokenValidator, verifyUserValidator } from '@/middlewares/users.middleware';
import { wrapRequestHandler } from '@/utils/handlers';
import express from 'express';
const bookmarksRouter = express.Router();

bookmarksRouter.post('/create', accessTokenValidator, verifyUserValidator);

export default bookmarksRouter;
