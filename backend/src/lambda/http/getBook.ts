import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { UserBookManager } from '../../manager/bookManager'
import { getUserId } from '../utils'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from "../../utils/logger";

const logger = createLogger('get');
const bookManager = new UserBookManager();

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const bookId = event.pathParameters.bookId;

  logger.info('Get bookById: ', bookId);

  const userId = getUserId(event);

  const book = await bookManager.getBook(userId, bookId);
  logger.info('Get book:', book);

  return {
    statusCode: 200,
    body: JSON.stringify({
      book: book
    })
  }
});

handler.use(
    cors({
      credentials: true
    })
);
