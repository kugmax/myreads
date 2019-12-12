import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { SaveBookRequest  } from '../../request/SaveBookRequest'
import { saveBook } from '../../manager/bookManager'
import { getUserId } from '../utils'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from "../../utils/logger";

const logger = createLogger('update');

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newBook: SaveBookRequest = JSON.parse(event.body);
  const bookId = event.pathParameters.bookId;

  logger.info('Update book: ', bookId, newBook);

  const userId = getUserId(event);

  const newItem = await saveBook(userId, bookId, newBook);
  logger.info('Book updated:', newItem);

  return {
    statusCode: 200,
    body: JSON.stringify({
      item: newItem
    })
  }
});

handler.use(
    cors({
      credentials: true
    })
);
