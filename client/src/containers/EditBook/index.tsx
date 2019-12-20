import React, {MouseEvent, useState} from 'react';
import Auth from "../../auth/Auth";
import { History } from 'history'
import {EditBookForm} from "../../components/EditBookForm";
import { saveBook, getUploadUrl, uploadFile  } from '../../api/books-api'
import {UserBook} from "../../model/UserBook";

import { useSnackbar } from 'notistack';

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
  const { enqueueSnackbar } = useSnackbar();

  const [book, setBook] = useState(DEFAULT_BOOK);
  const [cover, setCover] = useState({} as File);
  const [bookId, setBookId] = useState('');

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleChange = async (name: string, value:string | number) => {
    setBook(prevState => {
      return {...prevState, [name]: value}
    });
  };

  const handleSave = async (updatedBook: UserBook) => {
    setBook(updatedBook);
    setLoading(true);
    try {
      const savedBook: UserBook = await saveBook(props.auth.getIdToken(), updatedBook);
      setBookId(savedBook.bookId);

      enqueueSnackbar('Saved', {variant: 'success'});

      setActiveStep(1);
    } catch (e) {
      console.log(e);
      enqueueSnackbar(e.message, {variant: 'error'});
    }
    setLoading(false);
  };

  const handleUpload = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const uploadUrl = await getUploadUrl(props.auth.getIdToken(), bookId);
      await uploadFile(uploadUrl, cover);

      enqueueSnackbar('Uploaded', {variant: 'success'});
      redirectToHome();
    } catch (e) {
      console.log(e);
      enqueueSnackbar(e.message, {variant: 'error'});
    }
    setLoading(false);
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
                    handleUpload={handleUpload}
                    activeStep={activeStep}
                    loading={loading}/>

  );
};