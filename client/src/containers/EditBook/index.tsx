import React, {Component, useState} from 'react';
import Auth from "../../auth/Auth";
import { History } from 'history'
import {EditBookForm} from "../../components/EditBookForm";

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

  return (
      <EditBookForm book={book} handleChange={handleChange}/>
  );
};