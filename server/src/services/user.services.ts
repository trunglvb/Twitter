import { ETokenType, EUserVerifyStatus } from '@/constants/enums';
import { IRegisterRequestBody } from '@/models/requests/user.request';
import RefreshTokens from '@/models/schemas/refreshTokens.schema';
import User from '@/models/schemas/users.schema';
import databaseService from '@/services/database.services';
import { hashPassword } from '@/utils/crypto';
import { signToken } from '@/utils/jwt';
import { config } from 'dotenv';
import { ObjectId } from 'mongodb';

config();
class UsersService {
  signAccessToken = async (user_id: string) =>
    signToken({
      payload: {
        user_id,
        token_type: ETokenType.AccessToken
      },
      privateKey: process.env.JWT_SECRET as string,
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPRIRE_IN
      }
    });
  signRefreshToken = async (user_id: string) =>
    signToken({
      payload: {
        user_id,
        token_type: ETokenType.RefreshToken
      },
      privateKey: process.env.JWT_SECRET_REFRESHTOKEN as string,
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPRIRE_IN
      }
    });
  signEmailVerifyToken = async (user_id: string) =>
    signToken({
      payload: {
        user_id,
        token_type: ETokenType.EmailVerifyToken
      },
      privateKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string,
      options: {
        expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPRIE_IN
      }
    });
  signForgotPasswordToken = async (user_id: string) =>
    signToken({
      payload: {
        user_id,
        token_type: ETokenType.ForgotPasswordToken
      },
      privateKey: process.env.JWT_SECRET_FORGOT_PASSWORD_VERIFY_TOKEN as string,
      options: {
        expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPRIE_IN
      }
    });
  register = async (payload: IRegisterRequestBody) => {
    const user_id = new ObjectId();
    const emailVerifyToken = await this.signEmailVerifyToken(user_id.toString());
    await databaseService.users.insertOne(
      new User({
        ...payload,
        _id: user_id,
        email_verify_token: emailVerifyToken,
        date_of_birth: new Date(payload.date_of_birth),
        password: hashPassword(payload.password)
      })
    );
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(user_id.toString()),
      this.signRefreshToken(user_id.toString())
    ]);
    await databaseService.refreshTokens.insertOne(
      new RefreshTokens({
        token: refreshToken,
        user_id: user_id
      })
    );
    return { accessToken, refreshToken };
  };
  login = async (user: User) => {
    const { _id } = user;
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(_id?.toString() as string),
      this.signRefreshToken(_id?.toString() as string)
    ]);
    await databaseService.refreshTokens.insertOne(
      new RefreshTokens({
        token: refreshToken,
        user_id: _id as ObjectId
      })
    );
    return { accessToken, refreshToken, user };
  };
  logout = async (refresh_token: string) => {
    await databaseService.refreshTokens.deleteOne({ token: refresh_token });
  };
  checkEmailExist = async (email: string) => {
    const user = await databaseService.users.findOne({ email });
    return Boolean(user);
  };
  verifyEmail = async (user_id: string) => {
    const [_result, accessToken, refreshToken] = await Promise.all([
      databaseService.users.updateOne({ _id: new ObjectId(user_id) }, [
        {
          $set: {
            email_verify_token: '',
            updated_at: '$$NOW', //Mongo db cap nhat gia tri,
            verify: EUserVerifyStatus.Verified
          }
        }
      ]),
      this.signAccessToken(user_id?.toString()),
      this.signRefreshToken(user_id?.toString())
    ]);
    return { accessToken, refreshToken };
  };
  resendEmailVerify = async (user_id: string) => {
    //B1: send email
    const email_verify_token = await this.signEmailVerifyToken(user_id.toString());
    await databaseService.users.updateOne(
      {
        _id: new ObjectId(user_id)
      },
      [
        {
          $set: {
            email_verify_token: email_verify_token,
            updated_at: '$$NOW'
          }
        }
      ]
    );
  };
  updateForgotPasswordToken = async (user: User) => {
    const { _id } = user;
    const forgot_password_token = await this.signForgotPasswordToken(_id?.toString() as string);
    await databaseService.users.updateOne(
      {
        _id: _id
      },
      [
        {
          $set: {
            forgot_password_token: forgot_password_token,
            updated_at: '$$NOW'
          }
        }
      ]
    );
    //send mail kem link duong dan den verify-forgot-password => client se goi post va gui lai forgot_password_token len
    // https://twiter.com/fotgot-password?token=${token}
    return true;
  };
}

const userService = new UsersService();
export default userService;
