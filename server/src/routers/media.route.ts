import { uploadSingleImageController } from '@/controllers/media.controllers';
import { wrapRequestHandler } from '@/utils/handlers';
import express from 'express';
const mediaRouter = express.Router();

mediaRouter.post('/upload-file', wrapRequestHandler(uploadSingleImageController));
export default mediaRouter;
