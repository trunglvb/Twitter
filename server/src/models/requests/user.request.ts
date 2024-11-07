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
  day_of_birth?: string;
  bio?: string;
  location?: string;
  website?: string;
  username?: string;
  avatar?: string;
  cover_photo?: string;
}

export { IRegisterRequestBody, ITokenPayload, IUpdateMeBody };
