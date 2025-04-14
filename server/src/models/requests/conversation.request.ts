import { ParamsDictionary } from 'express-serve-static-core';
export interface IGetConversationParams extends ParamsDictionary {
  receiverId: string;
}
