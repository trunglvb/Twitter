import { defaultPagination } from '@/constants/constant';
import { ParamsDictionary } from 'express-serve-static-core';
import { NextFunction, Request, Response } from 'express';
import { HttpStatusCode } from '@/constants/enums';
import { ISearchQuery } from '@/models/requests/search.request';
import searchService from '@/services/search.services';

export const searchController = async (
  req: Request<ParamsDictionary, any, any, ISearchQuery>,
  res: Response,
  _next: NextFunction
) => {
  const { page = defaultPagination.page, limit = defaultPagination.limit, content } = req.query;
  const user_id = req.decode_access_token?.user_id;

  const result = await searchService.search({
    content: content,
    page: Number(page),
    limit: Number(limit),
    user_id: user_id
  });

  return res.status(HttpStatusCode.Ok).json({
    message: 'Get tweets success',
    result: {
      tweets: result,
      page: page,
      limit: limit
    }
  });
};
