import React, {useState, useEffect} from 'react';
import Auth from "../../auth/Auth";
import { History } from 'history'

import { getBooks } from '../../api/books-api'
import { UserBookReport } from "../../model/UserBookReport";
import { BooksList } from "../../components/BooksList";
import { Button } from '@material-ui/core';
import Grid from "@material-ui/core/Grid";
import { deleteBook  } from '../../api/books-api'
import InfiniteScroll from "react-infinite-scroll-component";

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

    console.log("fetchBooks");

    setLoading(true);
    try {
      const bookReportNew: UserBookReport = await getBooks(auth.getIdToken(), 6, nextKey);
      setBookReport( prevState => {
        return {
          books: bookReport.books.concat(bookReportNew.books),
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
              loader={<h4>Loading...</h4>}
              endMessage={
                <p style={{textAlign: 'center'}}>
                  <b>Yay! You have seen it all</b>
                </p>
              }
              refreshFunction={ () => fetchBooks(false)}
              pullDownToRefresh
              pullDownToRefreshContent={
                <h3 style={{textAlign: 'center'}}>&#8595; Pull down to refresh</h3>
              }
              releaseToRefreshContent={
                <h3 style={{textAlign: 'center'}}>&#8593; Release to refresh</h3>
              }>
            <BooksList list={bookReport.books} handleDelete={onDelete} handleClick={onEditButtonClick}/>
          </InfiniteScroll>
        </Grid>

      </Grid>
  );
};
