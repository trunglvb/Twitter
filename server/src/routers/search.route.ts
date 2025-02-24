import { searchController } from '@/controllers/search.controllers';
import express from 'express';
const searchRouter = express.Router();

searchRouter.get('/', searchController);

export default searchRouter;
