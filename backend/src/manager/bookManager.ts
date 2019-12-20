import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

import { SaveBookRequest } from "../request/SaveBookRequest";
import { UserBook } from "../model/UserBook";
import { UserBookStore } from "../lambda/store/userBookStore";

import * as uuid from 'uuid';
import { UserBookStatus } from "../model/UserBookStatus";
import {UserBookReport} from "../model/UserBookReport";
import {createLogger} from "../utils/logger";


const userBookStore = new UserBookStore();
const coverBucket = process.env.BOOKS_COVER_BUCKET;
const uploadUrlExpiration = process.env.BOOKS_COVER_URL_EXP_SECONDS;
const logger = createLogger('create');

const XAWS = AWSXRay.captureAWS(AWS);
const s3 = new XAWS.S3({
  signatureVersion: 'v4'
});

export class UserBookManager {

  async saveBook(userId: string, bookId: string, saveBookRequest: SaveBookRequest): Promise<UserBook> {

    let savedBook: UserBook;
    if (bookId) {
      savedBook = await this.getBook(userId, bookId);
    }

    return savedBook
        ? this.updateBook(userId, saveBookRequest, savedBook)
        : this.createNewBook(userId, saveBookRequest);
  }

  async createNewBook(userId: string, saveBookRequest: SaveBookRequest): Promise<UserBook> {
    const now = new Date().toISOString();
    const bookId = uuid.v4();

    const userBook = {
      bookId: bookId,
      userId: userId,
      createdAt: now,
      updatedAt: now,
      status: UserBookStatus.NONE,
      title: saveBookRequest.title,
      author: saveBookRequest.author,
      description: saveBookRequest.description,
      isbn: saveBookRequest.isbn,
      pages: saveBookRequest.pages,
      coverUrl: `https://${coverBucket}.s3.amazonaws.com/${userId}/${bookId}`
    };

    logger.info(`createNewBook: ${JSON.stringify(userBook)}`);

    return userBookStore.saveOrUpdate(userBook);
  }

  async updateBook(userId: string, saveBookRequest: SaveBookRequest, savedBook: UserBook): Promise<UserBook> {
    const now = new Date().toISOString();

    const userBook = {
      bookId: savedBook.bookId,
      userId: userId,
      createdAt: savedBook.createdAt,
      updatedAt: now,
      status: UserBookStatus.NONE,
      title: saveBookRequest.title,
      author: saveBookRequest.author,
      description: saveBookRequest.description,
      isbn: saveBookRequest.isbn,
      pages: saveBookRequest.pages,
      coverUrl: savedBook.coverUrl
    };

    logger.info(`updateBook: ${JSON.stringify(userBook)}`);

    return userBookStore.saveOrUpdate(userBook);
  }

  async getBook(userId: string, bookId: string): Promise<UserBook> {
    return userBookStore.getBookById(userId, bookId);
  }

  async getBooks(userId: string, limit: number, nextKey: string): Promise<UserBookReport> {
    return userBookStore.getBookByUserId(userId, limit, nextKey);
  }

  async deleteBook(userId: string, bookId: string): Promise<UserBook> {
    const book: UserBook = await this.getBook(userId, bookId);

    if (!book) {
      return undefined;
    }

    await userBookStore.delete(book);
    return book;
  }

  async changeBookStatus(userId: string, bookId: string, newStatus: string): Promise<string> {
    const book: UserBook = await this.getBook(userId, bookId);

    if (!book) {
      return undefined;
    }

    book.status = newStatus;
    book.updatedAt = new Date().toISOString();

    await userBookStore.saveOrUpdate(book);
    return newStatus;
  }

  async generateUploadBookCoverUrl(userId: string, bookId: string): Promise<string> {
    return s3.getSignedUrl('putObject', {
      Bucket: coverBucket,
      Key: userId + "/" + bookId,
      Expires: uploadUrlExpiration
    })
  }
}