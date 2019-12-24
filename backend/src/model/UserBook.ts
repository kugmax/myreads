export interface UserBook {
  userId: string
  createdAt: string,
  updatedAt: string,
  bookId: string,
  title: string,
  author: string,
  description: string
  isbn: string
  pages: number
  coverUrl: string
  rating: number
}