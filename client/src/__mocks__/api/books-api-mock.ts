import {UserBookReport} from "../../model/UserBookReport";
import {UserBook} from "../../model/UserBook";

export const mockUserBook_1: UserBook = {
  userId: "1",
  createdAt: '',
  updatedAt: '',
  status: 'NONE',
  bookId: "10",
  title: "Title 1",
  author: "Author 1",
  description: "desc 1",
  isbn: "123456789",
  pages: 55,
  coverUrl: "/mock_cover.jpg"
};

export const mockUserBookReport: UserBookReport = {
  books: [
    {
      ...mockUserBook_1
    },
    {
      userId: "2",
      createdAt: '',
      updatedAt: '',
      status: 'NONE',
      bookId: "11",
      title: "Title 2",
      author: "Author 2",
      description: "desc 2",
      isbn: "123456789",
      pages: 66,
      coverUrl: "/mock_cover.jpg"
    },
    {
      userId: "3",
      createdAt: '',
      updatedAt: '',
      status: 'NONE',
      bookId: "12",
      title: "Title 3",
      author: "Author 3",
      description: "desc 3",
      isbn: "123456789",
      pages: 67,
      coverUrl: "/mock_cover.jpg"
    }
  ]

};