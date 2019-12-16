import React, { Component } from 'react';
import Auth from "../../auth/Auth";
import { History } from 'history'

import { getBooks } from '../../api/books-api'
import { UserBook } from "../../model/UserBook";
import { UserBookReport } from "../../model/UserBookReport";
import { BooksList } from "../../components/BooksList";

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

  render() {
    return (
        <BooksList list={this.state.books}/>
    );
  }
}
