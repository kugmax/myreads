import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { UserBookManager } from '../../manager/bookManager'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from "../../utils/logger";
import {getUserId} from "../utils";

const logger = createLogger('uploadCover');
const bookManager = new UserBookManager();

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const bookId = event.pathParameters.bookId;
  const userId = getUserId(event);

  logger.info(`GenerateUploadBookCoverUrl: ${userId}, ${bookId}`);

  const url = await bookManager.generateUploadBookCoverUrl(userId, bookId);
  logger.info(`Url to upload cover: ${url}`);

  return {
    statusCode: 200,
    body: JSON.stringify({
      uploadUrl: url
    })
  }
});

handler.use(
    cors({
      credentials: true
    })
);
