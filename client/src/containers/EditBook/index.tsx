import React, {Component, MouseEvent, useState} from 'react';
import Auth from "../../auth/Auth";
import { History } from 'history'
import {EditBookForm} from "../../components/EditBookForm";
import { saveBook } from '../../api/books-api'

interface EditBookProps {
  auth: Auth
  history: History
}

const DEFAULT_BOOK = {
  title: '',
  author: '',
  description: '',
  isbn: '',
  pages: 0
};

export const EditBook: React.FC<EditBookProps> = ( props ) => {
  const [book, setBook] = useState(DEFAULT_BOOK);

  const handleChange = (name: string, value:string | number) => {
    setBook(prevState => {
      return {...prevState, [name]: value}
    });
  };

  const handleSave = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    await saveBook(props.auth.getIdToken(), book);
    props.history.push(`/home`);
  };

  return (
      <EditBookForm book={book} handleChange={handleChange} handleSave={handleSave} />
  );
};