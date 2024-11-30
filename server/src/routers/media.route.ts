import {
  uploadMultipleImageController,
  uploadSingleImageController,
  uploadVideoController
} from '@/controllers/media.controllers';
import { accessTokenValidator, verifyUserValidator } from '@/middlewares/users.middleware';
import { wrapRequestHandler } from '@/utils/handlers';
import express from 'express';
const mediaRouter = express.Router();

mediaRouter.post(
  '/upload-file',
  accessTokenValidator,
  verifyUserValidator,
  wrapRequestHandler(uploadSingleImageController)
);

mediaRouter.post(
  '/upload-file/multiple',
  accessTokenValidator,
  verifyUserValidator,
  wrapRequestHandler(uploadMultipleImageController)
);

mediaRouter.post('/upload-video', accessTokenValidator, verifyUserValidator, wrapRequestHandler(uploadVideoController));
export default mediaRouter;
