import { EUserVerifyStatus, HttpStatusCode } from '@/constants/enums';
import databaseService from '@/services/database.services';
import userService from '@/services/user.services';
import { hashPassword } from '@/utils/crypto';
import { ErrorWithStatus } from '@/utils/errors';
import { verifyToken } from '@/utils/jwt';
import validate from '@/utils/validation';
import { checkSchema } from 'express-validator';
import { JsonWebTokenError } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { ObjectId } from 'mongodb';
import { NextFunction, Request, Response } from 'express';

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
                  message: 'Access token is invalid',
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

const forgotPasswordTokenValidator = validate(
  checkSchema(
    {
      forgot_paswsword_token: {
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            if (!value) {
              throw new ErrorWithStatus({
                status: HttpStatusCode.Unauthorized,
                message: 'Forgot password token is required'
              });
            }
            try {
              const decode_forgot_password_token = await verifyToken({
                token: value,
                privateKey: process.env.JWT_SECRET_FORGOT_PASSWORD_VERIFY_TOKEN as string
              });
              const { user_id } = decode_forgot_password_token;
              req.decode_forgot_password_token = decode_forgot_password_token;
              const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) });
              if (user == null) {
                throw new ErrorWithStatus({
                  status: HttpStatusCode.NotFound,
                  message: 'User not found'
                });
              }
              if (user?.forgot_password_token !== value) {
                throw new ErrorWithStatus({
                  status: HttpStatusCode.Unauthorized,
                  message: 'Forgot password token is invalid'
                });
              }
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatus({
                  message: 'Forgot password token is invalid',
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

const resetPasswordValidator = validate(
  checkSchema(
    {
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
        },
        custom: {
          options: async (value, { req }) => {
            const { decode_access_token } = req;

            const { user_id } = decode_access_token;
            const user = await databaseService.users.findOne({ _id: new ObjectId(user_id as string) });
            const isMatchPassword = user?.password === hashPassword(value);
            if (!isMatchPassword) {
              throw new Error('Password is incorrect');
            }
            return true;
          }
        }
      },
      new_password: {
        notEmpty: {
          errorMessage: 'New password cannot be empty'
        },
        isLength: {
          options: { min: 6, max: 100 },
          errorMessage: 'New password must be between 6 and 8 characters'
        },
        isStrongPassword: {
          options: { minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 },
          errorMessage:
            'New password must be strong (at least one lowercase, one uppercase, one number, and one symbol)'
        }
      },
      confirm__new_password: {
        notEmpty: {
          errorMessage: 'Confirm new password cannot be empty'
        },
        isLength: {
          options: { min: 6, max: 100 },
          errorMessage: 'Confirm new password must be between 6 and 20 characters'
        },
        custom: {
          options: (value, { req }) => value === req.body.new_password,
          errorMessage: 'Passwords do not match'
        }
      }
    },
    ['body']
  )
);

const resetForgotPasswordValidator = validate(
  checkSchema(
    {
      new_password: {
        notEmpty: {
          errorMessage: 'New password cannot be empty'
        },
        isLength: {
          options: { min: 6, max: 100 },
          errorMessage: 'New password must be between 6 and 8 characters'
        },
        isStrongPassword: {
          options: { minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 },
          errorMessage:
            'New password must be strong (at least one lowercase, one uppercase, one number, and one symbol)'
        }
      },
      confirm_new_password: {
        notEmpty: {
          errorMessage: 'Confirm new password cannot be empty'
        },
        isLength: {
          options: { min: 6, max: 100 },
          errorMessage: 'Confirm new password must be between 6 and 20 characters'
        },
        custom: {
          options: (value, { req }) => value === req.body.new_password,
          errorMessage: 'Passwords do not match'
        }
      },
      forgot_password_token: {
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            if (!value) {
              throw new ErrorWithStatus({
                status: HttpStatusCode.Unauthorized,
                message: 'Token is required'
              });
            }
            try {
              const decode_forgot_password_token = await verifyToken({
                token: value,
                privateKey: process.env.JWT_SECRET_FORGOT_PASSWORD_VERIFY_TOKEN as string
              });
              if (decode_forgot_password_token == null) {
                throw new ErrorWithStatus({
                  status: HttpStatusCode.Unauthorized,
                  message: 'Token does not exits'
                });
              }
              req.decode_forgot_password_token = decode_forgot_password_token;
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatus({
                  message: 'Token is invalid',
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

const verifyUserValidator = (req: Request, _res: Response, next: NextFunction) => {
  const { verify } = req.decode_access_token!;
  if (verify !== EUserVerifyStatus.Verified) {
    throw new ErrorWithStatus({
      message: 'User not verified',
      status: HttpStatusCode.Forbidden
    });
  }
  next();
};

const updateMeValidator = validate(
  checkSchema(
    {
      name: {
        optional: true,
        isLength: {
          options: { max: 255 },
          errorMessage: 'Name must be between 1 and 255 characters'
        },
        isString: {
          errorMessage: 'Name must be string'
        },
        trim: true
      },
      date_of_birth: {
        optional: true,
        isISO8601: {
          options: { strict: true, strictSeparator: true },
          errorMessage: 'Date of birth must be a valid ISO 8601 date'
        }
      },
      bio: {
        optional: true,
        isString: {
          errorMessage: 'Bio must be string'
        },
        trim: true
      },
      location: {
        optional: true,
        isString: {
          errorMessage: 'Location must be string'
        },
        trim: true
      },
      website: {
        optional: true,
        isString: {
          errorMessage: 'Website must be string'
        },
        trim: true
      },
      username: {
        optional: true,
        isString: {
          errorMessage: 'User name must be string'
        },
        trim: true
      },
      avatar: {
        optional: true,
        isString: {
          errorMessage: 'Avatar url must be string'
        },
        trim: true
      },
      cover_photo: {
        optional: true,
        isString: {
          errorMessage: 'Cover photo must be string'
        },
        trim: true
      }
    },
    ['body']
  )
);

const followersValidator = validate(
  checkSchema(
    {
      // day cung la id cua uset, cahcn check xem user co ton tai hay khong
      followed_user_id: {
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            if (!ObjectId.isValid(value)) {
              throw new ErrorWithStatus({
                status: HttpStatusCode.NotFound,
                message: 'Followed user id is invalid'
              });
            }
            const followed_user = await databaseService.users.findOne({
              _id: new ObjectId(value)
            });
            if (followed_user == null) {
              throw new ErrorWithStatus({
                message: 'Followed user not found',
                status: HttpStatusCode.NotFound
              });
            }
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
  forgotPasswordEmailValidator,
  forgotPasswordTokenValidator,
  resetPasswordValidator,
  resetForgotPasswordValidator,
  verifyUserValidator,
  updateMeValidator,
  followersValidator
};
