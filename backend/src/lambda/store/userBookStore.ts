import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import {DocumentClient} from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../../utils/logger'

import { UserBook } from '../../model/UserBook'
import {UserBookReport} from "../../model/UserBookReport";

const logger = createLogger('useBookStore');
const XAWS = AWSXRay.captureAWS(AWS);

export class UserBookStore {

  constructor(
      private readonly docClient: DocumentClient = createDynamoDBClient(),
      private readonly bookTable = process.env.USER_BOOKS_TABLE,
      private readonly bookIndexName = process.env.USER_BOOKS_BOOKID_INDX
  ) {

  }

  async getBookByUserId(userId: string, limit: number, nextKey: string): Promise<UserBookReport> {
    let queryParams: any = {
      TableName: this.bookTable,
      IndexName: this.bookIndexName,
      Limit: limit,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    };

    if (nextKey) {
      logger.info(`add nextKey to query : ${nextKey}`);

      queryParams.ExclusiveStartKey = {
        Key: nextKey
      }
    }

    logger.info(`getBookByUserId.queryParams: ${JSON.stringify( queryParams ) }`);

    const result = await this.docClient.query(queryParams).promise();
    logger.info(`getBookByUserId: ${JSON.stringify(result)}`);

    const items: UserBook[] = result.Items as UserBook[];
    const newNextKey = result.LastEvaluatedKey ? result.LastEvaluatedKey.Key : undefined;

    return {
      books: items,
      nextKey: newNextKey
    }
  }

  async getBookById(userId: string, bookId: string): Promise<UserBook> {
    const result = await this.docClient.query({
      TableName: this.bookTable,
      IndexName: this.bookIndexName,
      KeyConditionExpression: 'bookId = :bookId and userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
        ':bookId': bookId
      }
    })
    .promise();

    if (result.Count == 0) {
      logger.warn(`Book by id not found: ${bookId}`);
      return null;
    }

    return result.Items[0] as UserBook;
  }

  async saveOrUpdate(book: UserBook): Promise<UserBook> {
    await this.docClient.put({
      TableName: this.bookTable,
      Item: book
    }).promise();

    return book
  }

  async delete(book: UserBook) {
    await this.docClient.delete({
      TableName: this.bookTable,
      Key: {
        "userId": book.userId,
        "createdAt": book.createdAt
      }
    }, logResponse)
  }

}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    logger.info('Creating a local DynamoDB instance');
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}

function logResponse(err, data) {
  if (err) logger.error(err, err.stack);
  else     logger.info(data);

}