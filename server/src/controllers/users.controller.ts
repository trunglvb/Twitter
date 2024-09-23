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

export { loginController };
