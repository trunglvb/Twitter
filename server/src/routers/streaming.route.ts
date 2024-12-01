import { streamingVideoController } from '@/controllers/streaming.controllers';
import express from 'express';
const streamingRoute = express.Router();

streamingRoute.get('/video-stream/:name', streamingVideoController);

export default streamingRoute;
