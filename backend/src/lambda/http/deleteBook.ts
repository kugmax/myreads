import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { deleteBook } from '../../manager/bookManager'
import { getUserId } from '../utils'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from "../../utils/logger";

const logger = createLogger('delete');

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const bookId = event.pathParameters.bookId;

  logger.info('Delete book: ', bookId);

  const userId = getUserId(event);

  const deletedBookId = await deleteBook(userId, bookId);
  logger.info('Book deleted:', deletedBookId);

  return {
    statusCode: 200,
    body: JSON.stringify({
      bookId: deletedBookId
    })
  }
});

handler.use(
    cors({
      credentials: true
    })
);
