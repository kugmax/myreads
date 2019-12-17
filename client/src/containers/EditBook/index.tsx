import React, {ChangeEvent, Component, MouseEvent, useState} from 'react';
import Auth from "../../auth/Auth";
import { History } from 'history'
import {EditBookForm} from "../../components/EditBookForm";
import { saveBook, getUploadUrl, uploadFile  } from '../../api/books-api'
import {UserBook} from "../../model/UserBook";

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
  const [cover, setCover] = useState({} as File);
  const [bookId, setBookId] = useState('');

  const handleChange = (name: string, value:string | number) => {
    setBook(prevState => {
      return {...prevState, [name]: value}
    });
  };

  const handleSave = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const savedBook: UserBook = await saveBook(props.auth.getIdToken(), book);
    setBookId(savedBook.bookId);
  //  TODO: error handling
  };

  const handleUpload = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const uploadUrl = await getUploadUrl(props.auth.getIdToken(), bookId);

    await uploadFile(uploadUrl, cover);

    redirectToHome();
  };

  const handleAddFileToUpload = async (files: File[]) => {
    if (!files) return;
    console.log(files[0]);
    setCover(files[0]);
  };

  const redirectToHome = () => {
    props.history.push(`/home`);
  };

  return (
      <EditBookForm book={book}
                    handleChange={handleChange}
                    handleSave={handleSave}
                    handleAddFileToUpload={handleAddFileToUpload}
                    handleUpload={handleUpload} />
  );
};