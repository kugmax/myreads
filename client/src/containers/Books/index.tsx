import React, {useState, useEffect} from 'react';
import Auth from "../../auth/Auth";
import { History } from 'history'

import { getBooks } from '../../api/books-api'
import { UserBookReport } from "../../model/UserBookReport";
import { BooksList } from "../../components/BooksList";
import { Button } from '@material-ui/core';
import Grid from "@material-ui/core/Grid";
import { deleteBook  } from '../../api/books-api'

interface BooksProps {
  auth: Auth
  history: History
}

export const Books: React.FC<BooksProps> = ( {auth, history} ) => {
  const [bookReport, setBookReport] = useState({books: [], nextKey: ''} as UserBookReport);
  const [nextKey, setNextKey] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect( () => {
    fetchBooks();
  }, [false]);

  const fetchBooks = async () => {
    try {
      const bookReport: UserBookReport = await getBooks(auth.getIdToken(), 5, nextKey);
      setBookReport(bookReport);
      setLoading(false);
    } catch (e) {
      alert(`Failed to fetch books: ${e.message}`);
    }
  };

  //TODO: need to fix path: /books/${bookId}/edit  /books/new
  const onEditButtonClick = (bookId: string) => {
    history.push(`/books/${bookId}/edit`)
  };

  const onDelete = async (bookId: string) => {
    console.log("delete " + bookId);
    await deleteBook(auth.getIdToken(), bookId);
  };

  return (
      <Grid container
            spacing={3}
            direction={"column"}
      >
        <Grid item xs={12}>
          <Button variant="contained" onClick={() => onEditButtonClick("0")} >Add new book</Button>
        </Grid>

        <Grid item xs={12}>
          <BooksList list={bookReport.books} handleDelete={onDelete}/>
        </Grid>

      </Grid>
  );
};
