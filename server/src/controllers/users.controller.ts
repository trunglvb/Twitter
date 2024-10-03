import { ParamsDictionary } from 'express-serve-static-core';
import userService from '@/services/user.services';
import { Request, Response } from 'express';
import { IRegisterRequestBody } from '@/models/requests/user.request';

const loginController = (req: Request, res: Response) => {
  res.json({
    data: [
      {
        id: 123
      }
    ]
  });
};

const registerController = async (req: Request<ParamsDictionary, any, IRegisterRequestBody>, res: Response) => {
  const { body } = req;
  try {
    const result = await userService.register(body);
    return res.status(200).json({
      message: 'Register success',
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
