import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { generateUploadBookCoverUrl } from '../../manager/bookManager'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from "../../utils/logger";

const logger = createLogger('uploadCover');

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const bookId = event.pathParameters.bookId;

  logger.info('GenerateUploadBookCoverUrl: ', bookId);

  const url = await generateUploadBookCoverUrl(bookId);
  logger.info('Url to upload cover:', url);

  return {
    statusCode: 200,
    body: JSON.stringify({
      urluploadUrl: url
    })
  }
});

handler.use(
    cors({
      credentials: true
    })
);
