
//TODO:

// changeBookStatus(userId, bookId, newStatus)
// const url = await generateUploadBookCoverUrl(bookId)

import { SaveBookRequest } from "../request/SaveBookRequest";
import { UserBook } from "../model/UserBook";
import { UserBookStore } from "../lambda/store/userBookStore";

import * as uuid from 'uuid';
import { UserBookStatus } from "../model/UserBookStatus";
import {UserBookReport} from "../model/UserBookReport";

const userBookStore = new UserBookStore();

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
    };

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
    };

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

}