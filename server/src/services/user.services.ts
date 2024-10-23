import { ETokenType } from '@/constants/enums';
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
  private readonly signAccessToken = async (user_id: string) =>
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
  private readonly signRefreshToken = async (user_id: string) =>
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
  register = async (payload: IRegisterRequestBody) => {
    const result = await databaseService.users.insertOne(
      new User({
        ...payload,
        date_of_birth: new Date(payload.date_of_birth),
        password: hashPassword(payload.password)
      })
    );
    const user_id = result.insertedId;
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
    const result = await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          email_verify_token: '',
          updated_at: new Date()
        }
      }
    );
    console.log(result);
  };
}

const userService = new UsersService();
export default userService;
