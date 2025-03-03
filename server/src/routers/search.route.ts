import { wrapRequestHandler } from '@/utils/handlers';
import { searchByHashtagController, searchController } from '@/controllers/search.controllers';
import { accessTokenValidator, verifyUserValidator } from '@/middlewares/users.middleware';
import express from 'express';
const searchRouter = express.Router();

searchRouter.get('/', accessTokenValidator, wrapRequestHandler(searchController));

searchRouter.get(
  '/search-by-hashtag',
  accessTokenValidator,
  verifyUserValidator,
  wrapRequestHandler(searchByHashtagController)
);

export default searchRouter;
