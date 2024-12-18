import { ParamsDictionary } from 'express-serve-static-core';

export type ICreateLikeBody = {
  tweet_id: string;
};

export interface IUnLikeParams extends ParamsDictionary {
  tweet_id: string;
}
