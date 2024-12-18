import { ParamsDictionary } from 'express-serve-static-core';

export type ICreateBookmarkBody = {
  tweet_id: string;
};

export interface IUnBookmarkParams extends ParamsDictionary {
  tweet_id: string;
}
