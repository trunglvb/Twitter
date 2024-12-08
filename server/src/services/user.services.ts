import axios from 'axios';
import { ETokenType, EUserVerifyStatus, HttpStatusCode } from '@/constants/enums';
import { IGoogleUser, IRegisterRequestBody, IUpdateMeBody } from '@/models/requests/user.request';
import Followers from '@/models/schemas/follower.schema';
import RefreshTokens from '@/models/schemas/refreshTokens.schema';
import User from '@/models/schemas/users.schema';
import databaseService from '@/services/database.services';
import { hashPassword } from '@/utils/crypto';
import { signToken } from '@/utils/jwt';
import { config } from 'dotenv';
import { ObjectId } from 'mongodb';
import { ErrorWithStatus } from '@/utils/errors';
import { generateFromEmail } from 'unique-username-generator';

config();
class UsersService {
  signAccessToken = async ({ user_id, verify }: { user_id: string; verify: EUserVerifyStatus }) =>
    signToken({
      payload: {
        user_id,
        verify,
        token_type: ETokenType.AccessToken
      },
      privateKey: process.env.JWT_SECRET as string,
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPRIRE_IN
      }
    });
  signRefreshToken = async ({ user_id, verify }: { user_id: string; verify: EUserVerifyStatus }) =>
    signToken({
      payload: {
        user_id,
        verify,
        token_type: ETokenType.RefreshToken
      },
      privateKey: process.env.JWT_SECRET_REFRESHTOKEN as string,
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPRIRE_IN
      }
    });
  signEmailVerifyToken = async ({ user_id, verify }: { user_id: string; verify: EUserVerifyStatus }) =>
    signToken({
      payload: {
        user_id,
        verify,
        token_type: ETokenType.EmailVerifyToken
      },
      privateKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string,
      options: {
        expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPRIE_IN
      }
    });
  signForgotPasswordToken = async ({ user_id, verify }: { user_id: string; verify: EUserVerifyStatus }) =>
    signToken({
      payload: {
        user_id,
        verify,
        token_type: ETokenType.ForgotPasswordToken
      },
      privateKey: process.env.JWT_SECRET_FORGOT_PASSWORD_VERIFY_TOKEN as string,
      options: {
        expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPRIE_IN
      }
    });
  register = async (payload: IRegisterRequestBody) => {
    const user_id = new ObjectId();
    const tokenPayLoad = {
      user_id: user_id.toString(),
      verify: EUserVerifyStatus.Unverified
    };
    const emailVerifyToken = await this.signEmailVerifyToken(tokenPayLoad);
    await databaseService.users.insertOne(
      new User({
        ...payload,
        _id: user_id,
        email_verify_token: emailVerifyToken,
        date_of_birth: new Date(payload.date_of_birth),
        password: hashPassword(payload.password),
        username: generateFromEmail(payload.email, 3)
      })
    );
    const [access_token, refresh_token] = await Promise.all([
      this.signAccessToken(tokenPayLoad),
      this.signRefreshToken(tokenPayLoad)
    ]);
    await databaseService.refreshTokens.insertOne(
      new RefreshTokens({
        token: refresh_token,
        user_id: user_id
      })
    );
    return { access_token, refresh_token };
  };
  login = async (user: User) => {
    const { _id, verify } = user;
    const tokenPayLoad = {
      user_id: _id?.toString() as string,
      verify: verify
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(tokenPayLoad),
      this.signRefreshToken(tokenPayLoad)
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
    const tokenPayLoad = {
      user_id: user_id?.toString(),
      verify: EUserVerifyStatus.Unverified
    };
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
      this.signAccessToken(tokenPayLoad),
      this.signRefreshToken(tokenPayLoad)
    ]);
    await databaseService.refreshTokens.insertOne(
      new RefreshTokens({
        token: refreshToken,
        user_id: new ObjectId(user_id)
      })
    );
    return { accessToken, refreshToken };
  };
  resendEmailVerify = async (user_id: string) => {
    //B1: send email
    const tokenPayLoad = {
      user_id: user_id?.toString(),
      verify: EUserVerifyStatus.Unverified
    };
    const email_verify_token = await this.signEmailVerifyToken(tokenPayLoad);
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
    const { _id, verify } = user;
    const tokenPayLoad = {
      user_id: _id?.toString() as string,
      verify: verify
    };
    const forgot_password_token = await this.signForgotPasswordToken(tokenPayLoad);
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
  resetPassword = async (user_id: string, new_password: string) => {
    await databaseService.users.updateOne(
      {
        _id: new ObjectId(user_id)
      },
      [
        {
          $set: {
            password: hashPassword(new_password),
            updated_at: '$$NOW'
          }
        }
      ]
    );
  };

  getProfile = async (user_id: string) => {
    const user = await databaseService.users.findOne(
      {
        _id: new ObjectId(user_id)
      },
      {
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0
        }
      }
    );
    return user;
  };

  updateMe = async ({ body, user_id }: { body: IUpdateMeBody; user_id: string }) => {
    const _body = body.date_of_birth ? { ...body, date_of_birth: new Date(body.date_of_birth) } : body;

    const user = await databaseService.users.findOneAndUpdate(
      {
        _id: new ObjectId(user_id)
      },
      {
        $set: {
          ...(_body as IUpdateMeBody & { date_of_birth?: Date })
        },
        $currentDate: {
          updated_at: true
        }
      },
      {
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0
        }
      }
    );
    return user;
  };

  follower = async ({ user_id, followed_user_id }: { user_id: string; followed_user_id: string }) => {
    const follower = await databaseService.followers.findOne({
      user_id: new ObjectId(user_id),
      followed_user_id: new ObjectId(followed_user_id)
    });
    if (follower == null) {
      await databaseService.followers.insertOne(
        new Followers({
          user_id: new ObjectId(user_id),
          followed_user_id: new ObjectId(followed_user_id)
        })
      );
      return { message: 'Follow user success' };
    }
    return { message: 'Followed' };
  };

  unfollow = async ({ user_id, followed_user_id }: { user_id: string; followed_user_id: string }) => {
    const user = await databaseService.followers.findOne({
      user_id: new ObjectId(user_id),
      followed_user_id: new ObjectId(followed_user_id)
    });
    if (user == null) {
      return { message: 'Already unfollowed' };
    }
    await databaseService.followers.deleteOne({
      user_id: new ObjectId(user_id),
      followed_user_id: new ObjectId(followed_user_id)
    });
    return { message: 'Unfollow success' };
  };

  //oauth
  private getOauthGoogleToken = async (code: string) => {
    const body = {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_AUTHORIZED_REDIRECT_URI,
      grant_type: 'authorization_code'
    };
    const { data } = await axios.post('https://oauth2.googleapis.com/token', body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return data as {
      access_token: string;
      id_token: string;
    };
  };

  private getGoolgeUser = async (access_token: string, id_token: string) => {
    const { data } = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
      params: {
        access_token,
        alt: 'json'
      },
      headers: {
        Authorization: `Bearer ${id_token}`
      }
    });
    return data as IGoogleUser;
  };

  oauth = async (code: string) => {
    //dung code thong qua google api de lay id_token va access token
    const { id_token, access_token } = await this.getOauthGoogleToken(code);
    const user = await this.getGoolgeUser(access_token, id_token);
    if (!user.verified_email) {
      throw new ErrorWithStatus({
        status: HttpStatusCode.BadGateway,
        message: 'Gmail is not verify'
      });
    }
    const alreadyUser = await databaseService.users.findOne({
      email: user.email
    });

    //da ton tai email thi login
    if (alreadyUser?.email) {
      const tokenPayLoad = {
        user_id: alreadyUser._id.toString(),
        verify: EUserVerifyStatus.Unverified
      };
      const [access_token, refresh_token] = await Promise.all([
        this.signAccessToken(tokenPayLoad),
        this.signRefreshToken(tokenPayLoad)
      ]);
      await databaseService.refreshTokens.insertOne(
        new RefreshTokens({
          token: refresh_token,
          user_id: alreadyUser._id
        })
      );
      return { access_token, refresh_token, newUser: false };
    } else {
      //chua co thi tao moi
      const password = Math.random().toString(36).substring(2, 7);
      const result = await this.register({
        name: user.name,
        email: user.email,
        date_of_birth: new Date().toISOString()!,
        password: password,
        confirm_password: password
      });
      return { ...result, newUser: true };
    }
  };

  refreshTokens = async (user_id: string, verify: EUserVerifyStatus, token: string) => {
    const tokenPayLoad = {
      user_id: user_id,
      verify: verify
    };
    const [access_token, refresh_token] = await Promise.all([
      this.signAccessToken(tokenPayLoad),
      this.signRefreshToken(tokenPayLoad),
      databaseService.refreshTokens.deleteOne({ token: token })
    ]);
    await databaseService.refreshTokens.insertOne(
      new RefreshTokens({
        token: refresh_token,
        user_id: new ObjectId(user_id)
      })
    );
    return { access_token, refresh_token };
  };
}

const userService = new UsersService();
export default userService;
