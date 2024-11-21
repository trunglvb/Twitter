import { ParamsDictionary } from 'express-serve-static-core';
import { EUserVerifyStatus } from '@/constants/enums';

type IRegisterRequestBody = {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
  date_of_birth: string;
};

type ITokenPayload = {
  user_id: string;
  verify: EUserVerifyStatus;
  token_type: number;
  iat: number;
  exp: number;
};

interface IUpdateMeBody {
  name?: string;
  date_of_birth?: string;
  bio?: string;
  location?: string;
  website?: string;
  username?: string;
  avatar?: string;
  cover_photo?: string;
}

interface IFollowedUserBody {
  followed_user_id: string;
}

interface IUnfollowUserParams extends ParamsDictionary {
  user_id: string;
}

type IGoogleUser = {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
};

export { IRegisterRequestBody, ITokenPayload, IUpdateMeBody, IFollowedUserBody, IUnfollowUserParams, IGoogleUser };
