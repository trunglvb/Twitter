import User from '@/models/schemas/users.schema';
import databaseService from '@/services/database.services';
import userService from '@/services/user.services';
import { Request, Response } from 'express';

const loginController = (req: Request, res: Response) => {
  res.json({
    data: [
      {
        id: 123
      }
    ]
  });
};

const registerController = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const result = await userService.register({ email, password, name });
    return res.json({
      noti: 'success',
      result: result
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: error
    });
  }
};

export { loginController, registerController };
