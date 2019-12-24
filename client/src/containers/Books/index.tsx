import React, {useState, useEffect} from 'react';
import Auth from "../../auth/Auth";
import { History } from 'history'

import { getBooks } from '../../api/books-api'
import { UserBookReport } from "../../model/UserBookReport";
import { BooksList } from "../../components/BooksList";
import { Button } from '@material-ui/core';
import Grid from "@material-ui/core/Grid";
import { deleteBook, rateBook } from '../../api/books-api'
import InfiniteScroll from "react-infinite-scroll-component";
import {UserBook} from "../../model/UserBook";
import update from 'immutability-helper';

interface BooksProps {
  auth: Auth
  history: History
}

export const Books: React.FC<BooksProps> = ( {auth, history} ) => {
  const [bookReport, setBookReport] = useState({books: [], nextKey: ''} as UserBookReport);
  const [loading, setLoading] = useState(false);

  useEffect( () => {
    fetchBooks(false);
  }, [false]);

  const fetchBooks = async (isLoadMore: boolean) => {
    const nextKey = isLoadMore && bookReport.nextKey ? bookReport.nextKey : '';

    setLoading(true);
    try {
      const bookReportNew: UserBookReport = await getBooks(auth.getIdToken(), 6, nextKey);

      const newBooks = isLoadMore ? bookReport.books.concat(bookReportNew.books) : bookReportNew.books;

      setBookReport( prevState => {
        return {
          books: newBooks,
          nextKey: bookReportNew.nextKey
        }
      });
    } catch (e) {
      alert(`Failed to fetch books: ${e.message}`);
    }

    setLoading(false);
  };

  const onCreateButtonClick = () => {
    history.push(`/books/create`)
  };

  const onEditButtonClick = (bookId: string) => {
    history.push(`/books/${bookId}/edit`)
  };

  const onDelete = async (bookId: string) => {
    console.log("delete " + bookId);
    setLoading(true);
    try {
      await deleteBook(auth.getIdToken(), bookId);
      await fetchBooks(false);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  const onRatingChanged = async (bookId: string, newRating: number) => {
    setBookReport(
        {books: await findAndRateIt(bookReport.books, bookId, newRating)}
    );

    try {
      await rateBook(auth.getIdToken(), bookId, {newRating: newRating});
    } catch (e) {
      console.log(e);
    }
  };

  const findAndRateIt = async (books: UserBook[], bookId: string, newRating: number): Promise<UserBook[]> => {
    const bookIndex = books.findIndex(b => b.bookId === bookId);

    if (bookIndex < 0) {
      return books;
    }

    const updatedBook = update(books[bookIndex], {rating: {$set: newRating}});

    return update(books, {
      $splice: [[bookIndex, 1, updatedBook]]
    });
  };

  const hasMore = () : boolean => {
    return bookReport && bookReport.nextKey !== undefined;
  };

  return (
      <Grid container
            spacing={3}
            direction={"column"}
      >
        <Grid item xs={12}>
          <Button variant="contained"
                  disabled={loading}
                  onClick={() => onCreateButtonClick()} >Add new book
          </Button>
        </Grid>

        <Grid item xs={12}>
          <InfiniteScroll
              dataLength={bookReport.books.length}
              next={ () => fetchBooks(true)}
              hasMore={hasMore() }
              loader=""
              refreshFunction={ () => fetchBooks(false)}
              pullDownToRefresh={false}
          >
            <BooksList list={bookReport.books} handleDelete={onDelete} handleClick={onEditButtonClick} handleRating={onRatingChanged}/>
          </InfiniteScroll>
        </Grid>

      </Grid>
  );
};
