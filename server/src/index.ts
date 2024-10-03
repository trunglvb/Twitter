import express from 'express';
import usersRouter from '@/routers/users.router';
const app = express();
const port = 4000;
import dotenv from 'dotenv';
import databaseService from '@/services/database.services';
import userService from '@/services/user.services';

dotenv.config();
app.use(express.json()); // parse sang dang json de xu ly body gui len
app.use('/users', usersRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

databaseService.connect().catch(console.dir);
