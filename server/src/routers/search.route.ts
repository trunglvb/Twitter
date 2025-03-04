import { wrapRequestHandler } from '@/utils/handlers';
import { searchByHashtagController, searchController } from '@/controllers/search.controllers';
import { accessTokenValidator, verifyUserValidator } from '@/middlewares/users.middleware';
import express from 'express';
import searchValidator from '@/middlewares/search.middleware';
const searchRouter = express.Router();

searchRouter.get('/', accessTokenValidator, verifyUserValidator, searchValidator, wrapRequestHandler(searchController));

searchRouter.get(
  '/search-by-hashtag',
  accessTokenValidator,
  verifyUserValidator,
  searchValidator,
  wrapRequestHandler(searchByHashtagController)
);

export default searchRouter;
