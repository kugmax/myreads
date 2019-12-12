import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { SaveBookRequest  } from '../../request/SaveBookRequest'
import { UserBookManager } from '../../manager/bookManager'
import { getUserId } from '../utils'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from "../../utils/logger";

const logger = createLogger('create');
const bookManager = new UserBookManager();

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newBook: SaveBookRequest = JSON.parse(event.body);

  logger.info('Create book: ', newBook);

  const userId = getUserId(event);

  const newItem = await bookManager.saveBook(userId, null, newBook);
  logger.info('New book created:', newItem);

  return {
    statusCode: 201,
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
