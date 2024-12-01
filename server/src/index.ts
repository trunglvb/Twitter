import express from 'express';
import usersRouter from '@/routers/users.router';
const app = express();
const port = 4000;
import dotenv from 'dotenv';
import databaseService from '@/services/database.services';
import { defaultError } from '@/middlewares/error.middleware';
import mediaRouter from '@/routers/media.route';
import { initFolder } from '@/utils/file';
import { UPLOAD_IMAGE_DIR, UPLOAD_STATIC_DIR, UPLOAD_VIDEO_DIR } from '@/constants/dir';
import { streamingVideoController } from '@/controllers/streaming.controllers';
import streamingRoute from '@/routers/streaming.route';

initFolder();
dotenv.config();
databaseService.connect().catch(console.dir);
app.use(express.json()); // parse sang dang json de xu ly body gui len
//error handler
app.use(defaultError);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

//route
app.use('/api/users', usersRouter);
app.use('/api/media', mediaRouter);
app.use('/static', streamingRoute);

//static path
app.use('/static/image', express.static(UPLOAD_IMAGE_DIR));
app.use('/static/video', express.static(UPLOAD_VIDEO_DIR));
