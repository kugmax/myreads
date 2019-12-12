// changeBookStatus(userId, bookId, newStatus)


// const deletedBookId = await deleteBook(userId, bookId);

// const books: UserBook[] = await getUserBooks(userId, limit, nextKey);
// const url = await generateUploadBookCoverUrl(bookId)



//  TODO: need return result
// const items = result.Items;
// return items as UserBook[];
// lastEvaluatedKey

import { SaveBookRequest } from "../request/SaveBookRequest";
import { UserBook } from "../model/UserBook";
import { UserBookStore } from "../lambda/store/userBookStore";

import * as uuid from 'uuid';
import {UserBookStatus} from "../model/UserBookStatus";

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

}