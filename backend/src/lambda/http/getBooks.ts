import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { getUserBooks } from '../../manager/bookManager'
import { getUserId, getQueryParameter } from '../utils'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from "../../utils/logger";
import { UserBook } from "../../model/UserBook";

const logger = createLogger('report');

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const limit = getQueryParameter(event,"limit");
  const nextKey = getQueryParameter(event, "nextKey");
  const userId = getUserId(event);

  logger.info('Get books by user: ', userId, limit, nextKey);

  const books: UserBook[] = await getUserBooks(userId, limit, nextKey);
  logger.info('User books:', books);

  return {
    statusCode: 200,
    body: JSON.stringify({
      books: books
    })
  }
});

handler.use(
    cors({
      credentials: true
    })
);
