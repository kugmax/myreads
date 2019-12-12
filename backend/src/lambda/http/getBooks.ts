import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { UserBookManager } from '../../manager/bookManager'
import { getUserId, getQueryParameter } from '../utils'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from "../../utils/logger";
import {UserBookReport} from "../../model/UserBookReport";

const logger = createLogger('report');
const bookManager = new UserBookManager();

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const limit = Number(getQueryParameter(event,"limit"));
  const nextKey = getQueryParameter(event, "nextKey");
  const userId = getUserId(event);

  logger.info('Get books by user: ', userId, limit, nextKey);

  const bookReport: UserBookReport = await bookManager.getBooks(userId, limit, nextKey);
  logger.info('User books:', bookReport);

  return {
    statusCode: 200,
    body: JSON.stringify({
      ...bookReport
    })
  }
});

handler.use(
    cors({
      credentials: true
    })
);
