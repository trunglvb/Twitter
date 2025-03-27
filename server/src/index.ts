import express from 'express';
import usersRouter from '@/routers/users.router';
const port = 4000;
import dotenv from 'dotenv';
import databaseService from '@/services/database.services';
import { defaultError } from '@/middlewares/error.middleware';
import mediaRouter from '@/routers/media.route';
import { initFolder } from '@/utils/file';
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from '@/constants/dir';
import streamingRoute from '@/routers/streaming.route';
import tweetRouter from '@/routers/tweet.route';
import bookmarksRouter from '@/routers/bookmark.route';
import likesRouter from '@/routers/like.route';
import searchRouter from '@/routers/search.route';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
// import '@/utils/faker';

const app = express();
//socket io
const httpServer = createServer();
app.use(cors());
initFolder();
dotenv.config();
databaseService
  .connect()
  .then(() => {
    databaseService.indexUsers();
    databaseService.indexRefreshToken();
    databaseService.indexFollower();
    databaseService.indexBookmark();
    databaseService.indexTweets();
    databaseService.indexHashtag();
  })
  .catch(console.dir);
app.use(express.json()); // parse sang dang json de xu ly body gui len

//route
app.use('/api/users', usersRouter);
app.use('/api/media', mediaRouter);
app.use('/api/tweet', tweetRouter);
app.use('/api/bookmark', bookmarksRouter);
app.use('/api/like', likesRouter);
app.use('/static', streamingRoute);
app.use('/api/search', searchRouter);

//static path
app.use('/static/image', express.static(UPLOAD_IMAGE_DIR));
app.use('/static/video', express.static(UPLOAD_VIDEO_DIR));

//error handler
app.use(defaultError);

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173'
  }
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  socket.on('hello', (arg) => {
    console.log(arg); // lay gia tri tu client gui len voi su kien hello
  });
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
