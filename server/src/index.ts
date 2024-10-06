import express, { Request, Response, NextFunction } from 'express';
import usersRouter from '@/routers/users.router';
const app = express();
const port = 4000;
import dotenv from 'dotenv';
import databaseService from '@/services/database.services';

dotenv.config();
databaseService.connect().catch(console.dir);
app.use(express.json()); // parse sang dang json de xu ly body gui len

//route
app.use('/users', usersRouter);

//error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  return res.status(400).json({
    error: err.message
  });
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
