import express from 'express';
import usersRouter from '@/routers/users.router';
const app = express();
const port = 4000;
import dotenv from 'dotenv';
import databaseService from '@/services/database.services';

dotenv.config();
databaseService.connect().catch(console.dir);
app.use(express.json()); // parse sang dang json de xu ly body gui len

//error handler
app.use((err, _req, res, _next) => {
  res.status(400).json({
    error: err.message
  });
});

//route
app.use('/users', usersRouter);
