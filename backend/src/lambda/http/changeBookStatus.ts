import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { SaveBookRequest  } from '../../request/ChangeBookStatus.ts'
import { changeBookStatus } from '../../manager/bookManager'
import { getUserId } from '../utils'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from "../../utils/logger";

const logger = createLogger('changeStatus');

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newStatus: SaveBookRequest = JSON.parse(event.body);
  const bookId = event.pathParameters.bookId;

  logger.info('Change book status: ', bookId, newStatus);

  const userId = getUserId(event);

  await changeBookStatus(userId, bookId, newStatus);

  return {
    statusCode: 200,
    body: JSON.stringify({
      newStatus: newStatus
    })
  }
});

handler.use(
    cors({
      credentials: true
    })
);