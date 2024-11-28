import express from 'express';
import usersRouter from '@/routers/users.router';
const app = express();
const port = 4000;
import dotenv from 'dotenv';
import databaseService from '@/services/database.services';
import { defaultError } from '@/middlewares/error.middleware';
import mediaRouter from '@/routers/media.route';
import { initFolder } from '@/utils/file';
import argv from 'minimist';
import path from 'path';
import { UPLOAD_DIR } from '@/constants/dir';

initFolder();
dotenv.config();
databaseService.connect().catch(console.dir);
app.use(express.json()); // parse sang dang json de xu ly body gui len
app.use('/uploads', express.static(UPLOAD_DIR));

//route
app.use('/api/users', usersRouter);
app.use('/api/media', mediaRouter);

//error handler
app.use(defaultError);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
