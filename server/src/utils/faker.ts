import { IRegisterRequestBody } from '@/models/requests/user.request';
import { faker } from '@faker-js/faker';
import { ObjectId } from 'mongodb';
import { ETweetAudience, ETweetType, EUserVerifyStatus, HttpStatusCode } from '@/constants/enums';
import { ICreateTweetBody } from '@/models/requests/tweet.request';
import Followers from '@/models/schemas/follower.schema';
import User from '@/models/schemas/users.schema';
import databaseService from '@/services/database.services';
import tweetServices from '@/services/tweet.services';
import { hashPassword } from '@/utils/crypto';

//password for fake user
const PASSWORD = 'Baotrung0311@';

//id account, use to follow
const MYID = new ObjectId('6755ace700e5dc08a6cb44d9');

//so luong user duoc tao, moi user mac dinh 2 tweet
const USER_COUNT = 100;

export const createRandomUser = () => {
  const user: IRegisterRequestBody = {
    name: faker.internet.displayName(),
    email: faker.internet.email(),
    password: PASSWORD,
    confirm_password: PASSWORD,
    date_of_birth: faker.date.past().toISOString()
  };
  return user;
};

export const createRandomTweet = () => {
  const tweet: ICreateTweetBody = {
    type: ETweetType.Tweet,
    audience: ETweetAudience.Everyone,
    content: faker.lorem.paragraph({
      min: 10,
      max: 100
    }),
    parent_id: null,
    hashtags: [],
    mentions: [],
    medias: []
  };
  return tweet;
};

export const users: IRegisterRequestBody[] = faker.helpers.multiple(createRandomUser, {
  count: 100
});

const insertMultipleUsers = async (users: IRegisterRequestBody[]) => {
  console.log('Creating users...');
  const result = await Promise.all(
    users.map(async (user) => {
      const user_id = new ObjectId();
      await databaseService.users.insertOne(
        new User({
          ...user,
          username: `user${user_id.toString()}`,
          password: hashPassword(user.password),
          date_of_birth: new Date(user.date_of_birth),
          verify: EUserVerifyStatus.Verified
        })
      );
      return user_id;
    })
  );

  return result;
};

export const followMultipleUsers = async (user_id: ObjectId, followed_user_ids: ObjectId[]) => {
  await Promise.all(
    followed_user_ids.map(
      async (followed_user_id) =>
        await databaseService.followers.insertOne(
          new Followers({
            user_id,
            followed_user_id: new ObjectId(followed_user_id)
          })
        )
    )
  );
};

export const insertMultipleTweets = async (user_ids: ObjectId[]) => {
  console.log('Creating tweet');
  let count = 0;
  const result = await Promise.all([
    user_ids.map(async (user_id) => {
      await Promise.all([
        tweetServices.create({ user_id: user_id.toString(), body: createRandomTweet() }),
        tweetServices.create({ user_id: user_id.toString(), body: createRandomTweet() })
      ]);
      count++;
      console.log(`Craeted ${count} tweets`);
    })
  ]);
  return result;
};

insertMultipleUsers(users).then((ids) => {
  followMultipleUsers(new ObjectId(MYID), ids);
  insertMultipleTweets(ids);
});
