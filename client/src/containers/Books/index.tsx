import React, { Component } from 'react';
import Auth from "../../auth/Auth";
import { History } from 'history'

import { getBooks } from '../../api/books-api'
import { UserBook } from "../../model/UserBook";
import { UserBookReport } from "../../model/UserBookReport";
import { BooksList } from "../../components/BooksList";
import { Button } from '@material-ui/core';

interface BooksProps {
  auth: Auth
  history: History
}

interface BooksState {
  books: UserBook[],
  nextKey?: string,
  loading: boolean
}

export default class Books extends Component<BooksProps, BooksState> {
  state: BooksState = {
    books: [],
    nextKey: '',
    loading: true
  };

  async componentDidMount() {
    await this.fetchBooks();
  }

  async fetchBooks() {
    try {
      const bookReport: UserBookReport = await getBooks(this.props.auth.getIdToken(), 5, this.state.nextKey);
      this.setState({
        books: bookReport.books,
        nextKey: bookReport.nextKey,
        loading: false
      })
    } catch (e) {
      alert(`Failed to fetch books: ${e.message}`);
    }
  }

  //TODO: need to fix path: /books/${bookId}/edit  /books/new
  onEditButtonClick = (bookId: string) => {
    this.props.history.push(`/books/${bookId}/edit`)
  };

  render() {
    return (
        <div>
        <Button variant="contained" onClick={() => this.onEditButtonClick("0")} >Add new book</Button>
        <BooksList list={this.state.books}/>
        </div>
    );
  }
}
