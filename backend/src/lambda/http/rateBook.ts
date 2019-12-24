import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { RateBookRequest} from '../../request/RateBookRequest'
import { UserBookManager } from '../../manager/bookManager'
import { getUserId } from '../utils'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from "../../utils/logger";

const logger = createLogger('rateBook');
const userBookManager = new UserBookManager();

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newRating: number = (JSON.parse(event.body) as RateBookRequest).newRating;

  if (newRating < 0 || newRating > 5) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Rating should be between 0 and 5"
      })
    }
  }


  const bookId = event.pathParameters.bookId;

  logger.info('Rate book: ', bookId, newRating);

  const userId = getUserId(event);

  await userBookManager.rateBook(userId, bookId, newRating);

  return {
    statusCode: 200,
    body: JSON.stringify({
      status: newRating
    })
  }
});

handler.use(
    cors({
      credentials: true
    })
);