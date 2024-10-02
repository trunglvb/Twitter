import User from '@/models/schemas/users.schema';
import databaseService from '@/services/database.services';

class UsersService {
  async register(payload: { email: string; password: string; name?: string }) {
    const { email, password, name } = payload;
    const result = await databaseService.users.insertOne(
      new User({
        name,
        email,
        password
      })
    );
    return result;
  }
  async checkEmailExist(email: string) {
    const user = databaseService.users.findOne({ email });
    console.log('user', user);
    return Boolean(user);
  }
}

const userService = new UsersService();
export default userService;
