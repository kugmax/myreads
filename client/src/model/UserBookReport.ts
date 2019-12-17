import { UserBook } from "./UserBook";

export interface UserBookReport {
  books: UserBook[],
  nextKey?: string
}