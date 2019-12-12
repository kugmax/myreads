import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { ChangeBookStatusRequest} from '../../request/ChangeBookStatusRequest'
import { UserBookManager } from '../../manager/bookManager'
import { getUserId } from '../utils'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from "../../utils/logger";

const logger = createLogger('changeStatus');
const userBookManager = new UserBookManager();

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newStatus = (JSON.parse(event.body) as ChangeBookStatusRequest).newStatus;
  const bookId = event.pathParameters.bookId;

  logger.info('Change book status: ', bookId, newStatus);

  const userId = getUserId(event);

  await userBookManager.changeBookStatus(userId, bookId, newStatus);

  return {
    statusCode: 200,
    body: JSON.stringify({
      status: newStatus
    })
  }
});

handler.use(
    cors({
      credentials: true
    })
);