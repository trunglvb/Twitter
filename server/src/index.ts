import { ObjectId } from 'mongodb';
import express from 'express';
import usersRouter from '@/routers/users.route';
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
import conversationRouter from '@/routers/conversation.route';
import Conversations from '@/models/schemas/conversations.schema';
// import '@/utils/faker';

const app = express();
//socket io
const httpServer = createServer(app);
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
app.use('/api/conversation', conversationRouter);

//static path
app.use('/static/image', express.static(UPLOAD_IMAGE_DIR));
app.use('/static/video', express.static(UPLOAD_VIDEO_DIR));

//error handler
app.use(defaultError);

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173' //client
  }
});

const users: {
  [key: string]: {
    socket_id: string;
  };
} = {};

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  const user_id = socket.handshake.auth._id;

  //gán user_id làm key socket.id la value
  users[user_id] = {
    socket_id: socket.id
  };

  socket.on('send_message', async (data) => {
    const { payload } = data;

    //receiver_id là id của người nhận, lấy ra socket id của người nhận
    const reciver_socket_id = users[payload.receiver_id]?.socket_id;
    if (!reciver_socket_id) return;

    const conversation = new Conversations({
      receiver_id: new ObjectId(payload.receiver_id as string),
      sender_id: new ObjectId(payload.sender_id as string),
      content: data.payload?.content
    });

    const result = await databaseService.conversation.insertOne(conversation);
    conversation._id = result.insertedId;

    //gửi sự kiện đến người nhận
    socket.to(reciver_socket_id).emit('receive_message', {
      payload: conversation
    });
  });

  socket.on('disconnect', () => {
    delete users[user_id];
    console.log(`User disconnected: ${socket.id}`);
  });
});

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
