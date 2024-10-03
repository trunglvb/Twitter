import userService from '@/services/user.services';
import validate from '@/utils/validation';
import { Request, Response, NextFunction } from 'express';
import { checkSchema } from 'express-validator';

const loginValidator = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      error: 'Missing email or password'
    });
  }
  next();
};

const registerValidator = validate(
  checkSchema({
    name: {
      notEmpty: {
        errorMessage: 'Name cannot be empty'
      },
      isLength: {
        options: { min: 1, max: 255 },
        errorMessage: 'Name must be between 1 and 255 characters'
      },
      trim: true
    },
    email: {
      notEmpty: {
        errorMessage: 'Email cannot be empty'
      },
      isEmail: {
        errorMessage: 'Invalid email format'
      },
      trim: true,
      custom: {
        options: async (value) => {
          const isExistEmail = await userService.checkEmailExist(value);
          if (isExistEmail) {
            throw new Error('Email already exist');
          }
          return true;
        }
      }
    },
    password: {
      notEmpty: {
        errorMessage: 'Password cannot be empty'
      },
      isLength: {
        options: { min: 6, max: 8 },
        errorMessage: 'Password must be between 6 and 8 characters'
      },
      isStrongPassword: {
        options: { minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 },
        errorMessage: 'Password must be strong (at least one lowercase, one uppercase, one number, and one symbol)'
      }
    },
    confirm_password: {
      notEmpty: {
        errorMessage: 'Confirm password cannot be empty'
      },
      isLength: {
        options: { min: 6, max: 20 },
        errorMessage: 'Confirm password must be between 6 and 20 characters'
      },
      custom: {
        options: (value, { req }) => value === req.body.password,
        errorMessage: 'Passwords do not match'
      }
    },
    date_of_birth: {
      isISO8601: {
        options: { strict: true, strictSeparator: true },
        errorMessage: 'Date of birth must be a valid ISO 8601 date'
      }
    }
  })
);

export { loginValidator, registerValidator };