import React, { Component } from 'react';
import Auth from "../../auth/Auth";
import { History } from 'history'

interface BooksProps {
  auth: Auth
  history: History
}

interface BooksState {
  // books: Book[]
  // loading: boolean
}

export default class Books extends Component<BooksProps, BooksState> {
  render() {
    return (
        <>Books container </>
    );
  }
}
