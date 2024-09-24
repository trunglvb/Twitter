import { Collection, Db, MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import User from '@/models/schemas/users.schema';
dotenv.config();

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@twitter.6nmgf.mongodb.net/`;

class DatabaseService {
  private client: MongoClient;
  private db: Db;
  constructor() {
    this.client = new MongoClient(uri);
    this.db = this.client.db(`${process.env.DB_NAME}`);
  }
  async connect() {
    try {
      // Send a ping to confirm a successful connection
      await this.db.command({ ping: 1 });
      console.log('Pinged your deployment. You successfully connected to MongoDB!');
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      //always run ignore try or catch, so need comment client.close()
      // await this.client.close();
    }
  }

  //getter, truy cap gia trị của db collection ở nơi khác bằng cách sử dụng databaseService.users
  get users(): Collection<User> {
    return this.db.collection('users');
  }
}

const databaseService = new DatabaseService();
export default databaseService;
