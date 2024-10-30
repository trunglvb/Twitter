import { HttpStatusCode } from '@/constants/enums';
import databaseService from '@/services/database.services';
import userService from '@/services/user.services';
import { hashPassword } from '@/utils/crypto';
import { ErrorWithStatus } from '@/utils/errors';
import { verifyToken } from '@/utils/jwt';
import validate from '@/utils/validation';
import { checkSchema } from 'express-validator';
import { JsonWebTokenError } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const loginValidator = validate(
  checkSchema(
    {
      email: {
        notEmpty: {
          errorMessage: 'Email cannot be empty'
        },
        isEmail: {
          errorMessage: 'Invalid email format'
        },
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const user = await databaseService.users.findOne({
              email: value,
              password: hashPassword(req.body.password)
            });
            if (!user) {
              throw new Error('Email or password is incorrect');
            }
            req.user = user;
            return true;
          }
        }
      },
      password: {
        notEmpty: {
          errorMessage: 'Password cannot be empty'
        },
        isLength: {
          options: { min: 6, max: 100 },
          errorMessage: 'Password must be between 6 and 8 characters'
        },
        isStrongPassword: {
          options: { minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 },
          errorMessage: 'Password must be strong (at least one lowercase, one uppercase, one number, and one symbol)'
        }
      }
    },
    ['body']
  )
);

const registerValidator = validate(
  checkSchema(
    {
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
          options: { min: 6, max: 100 },
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
          options: { min: 6, max: 100 },
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
    },
    ['body']
  )
);

const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            if (!value) {
              throw new ErrorWithStatus({
                status: HttpStatusCode.Unauthorized,
                message: 'Access token is required'
              });
            }
            const accessToken = value?.split(' ')[1];
            if (!accessToken) {
              throw new ErrorWithStatus({ status: HttpStatusCode.Unauthorized, message: 'Token is invalid' });
            }
            try {
              const decode_access_token = await verifyToken({
                token: accessToken,
                privateKey: process.env.JWT_SECRET as string
              });
              req.decode_access_token = decode_access_token;
              if (decode_access_token == null) {
                throw new ErrorWithStatus({ status: HttpStatusCode.Unauthorized, message: 'Token is invalid' });
              }
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatus({
                  message: 'Refresh token is invalid',
                  status: HttpStatusCode.Unauthorized
                });
              }
              throw error;
            }
            return true;
          }
        }
      }
    },
    ['headers']
  )
);

const refreshTokenValidator = validate(
  checkSchema(
    {
      refresh_token: {
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            if (!value) {
              throw new ErrorWithStatus({
                status: HttpStatusCode.Unauthorized,
                message: 'Refresh token is required'
              });
            }
            try {
              const [decode_refresh_token, refreshToken] = await Promise.all([
                verifyToken({ token: value, privateKey: process.env.JWT_SECRET_REFRESHTOKEN as string }),
                databaseService.refreshTokens.findOne({ token: value })
              ]);
              if (refreshToken == null) {
                throw new ErrorWithStatus({
                  status: HttpStatusCode.Unauthorized,
                  message: 'Refresh token does not exits'
                });
              }

              req.decode_refresh_token = decode_refresh_token;
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatus({
                  message: 'Refresh token is invalid',
                  status: HttpStatusCode.Unauthorized
                });
              }
              throw error;
            }
            return true;
          }
        }
      }
    },
    ['body']
  )
);

const emailVerifyTokenValidator = validate(
  checkSchema(
    {
      email_verify_token: {
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            if (!value) {
              throw new ErrorWithStatus({
                status: HttpStatusCode.Unauthorized,
                message: 'Email verify is required'
              });
            }
            try {
              const decode_email_verify_token = await verifyToken({
                token: value,
                privateKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string
              });
              req.decode_email_verify_token = decode_email_verify_token;
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatus({
                  message: 'Email verify token is invalid',
                  status: HttpStatusCode.Unauthorized
                });
              }
              throw error;
            }
            return true;
          }
        }
      }
    },
    ['body']
  )
);

const forgotPasswordEmailValidator = validate(
  checkSchema(
    {
      email: {
        notEmpty: {
          errorMessage: 'Email cannot be empty'
        },
        isEmail: {
          errorMessage: 'Invalid email format'
        },
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const user = await databaseService.users.findOne({
              email: value
            });
            if (!user) {
              throw new Error('Email is incorrect');
            }
            req.user = user;
            return true;
          }
        }
      }
    },
    ['body']
  )
);

export {
  loginValidator,
  registerValidator,
  accessTokenValidator,
  refreshTokenValidator,
  emailVerifyTokenValidator,
  forgotPasswordEmailValidator
};
