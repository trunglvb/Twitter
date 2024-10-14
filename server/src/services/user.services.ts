import { ETokenType } from '@/constants/enums';
import { IRegisterRequestBody } from '@/models/requests/user.request';
import User from '@/models/schemas/users.schema';
import databaseService from '@/services/database.services';
import { hashPassword } from '@/utils/crypto';
import { signToken } from '@/utils/jwt';
import { config } from 'dotenv';
config();
class UsersService {
  private readonly signAccessToken = async (user_id: string) =>
    signToken({
      payload: {
        user_id,
        token_type: ETokenType.AccessToken
      },
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
    const user_id = result.insertedId.toString();
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(user_id),
      this.signRefreshToken(user_id)
    ]);
    // const user = await databaseService.users.findOne({ _id: result.insertedId });
    return { accessToken, refreshToken };
  };
  checkEmailExist = async (email: string) => {
    const user = await databaseService.users.findOne({ email });
    return Boolean(user);
  };
  comparePassword = async (email: string, password: string) => {
    const user = await databaseService.users.findOne({ email });
    const isCorrectPassword = hashPassword(password) === user?.password;
    return isCorrectPassword;
  };
}

const userService = new UsersService();
export default userService;
