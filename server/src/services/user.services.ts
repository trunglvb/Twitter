import { IRegisterRequestBody } from '@/models/requests/user.request';
import User from '@/models/schemas/users.schema';
import databaseService from '@/services/database.services';
import { hashPassword } from '@/utils/crypto';

class UsersService {
  async register(payload: IRegisterRequestBody) {
    const result = await databaseService.users.insertOne(
      new User({
        ...payload,
        date_of_birth: new Date(payload.date_of_birth),
        password: hashPassword(payload.password)
      })
    );
    return result;
  }
  async checkEmailExist(email: string) {
    const user = await databaseService.users.findOne({ email });
    console.log(user);
    return Boolean(user);
  }
}

const userService = new UsersService();
export default userService;
