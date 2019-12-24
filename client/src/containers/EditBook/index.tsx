import React, {useEffect, useState} from 'react';
import Auth from "../../auth/Auth";
import { History } from 'history'
import {EditBookForm} from "../../components/form/EditBookForm";
import {getBook, updateBook, getUploadUrl, uploadFile  } from '../../api/books-api'
import {UserBook} from "../../model/UserBook";

import { useSnackbar } from 'notistack';
import {UploadImage} from "../../components/UploadImage";

interface EditBookProps {
  auth: Auth
  history: History,
  match: {
    params: {
      bookId: string
    }
  }
}

export const EditBook: React.FC<EditBookProps> = ( props ) => {
  const { enqueueSnackbar } = useSnackbar();

  const [book, setBook] = useState({} as UserBook);
  const [cover, setCover] = useState({} as File);
  const [loading, setLoading] = useState(false);

  const getBookId = () : string => {
    return props.match.params.bookId
  };

  useEffect( () => {
      loadBook(getBookId());
    }, [false]);

  const loadBook = async (bookId: string) => {
    try {
      const userBook = await getBook(props.auth.getIdToken(), bookId);
      setBook(userBook);
    } catch (e) {
      console.log(e);
      enqueueSnackbar(e.message, {variant: 'error'});
    }
  };

  const handleSave = async (updatedBook: UserBook) => {
    setBook(updatedBook);
    setLoading(true);
    try {
      await updateBook(props.auth.getIdToken(), getBookId(), updatedBook);

      if (cover.name) {
        const uploadUrl = await getUploadUrl(props.auth.getIdToken(), getBookId());
        await uploadFile(uploadUrl, cover);
      }

      enqueueSnackbar('Saved', {variant: 'success'});
    } catch (e) {
      console.log(e);
      enqueueSnackbar(e.message, {variant: 'error'});
    }

    setLoading(false);

    redirectToHome();
  };

  const handleAddFileToUpload = async (files: File[]) => {
    if (!files) return;
    console.log("setCover", files[0]);
    setCover(files[0]);
  };

  const redirectToHome = () => {
    props.history.push(`/home`);
  };

  const form = () => {
    if (Object.entries(book).length === 0) {
      return (<h4>Loading...</h4>)
    } else {
      return (
          <>
            <UploadImage
                bookId={getBookId()}
                currentUrl={book.coverUrl}
                handleClick={handleAddFileToUpload}
            />
            <EditBookForm book={book}
                          handleSave={handleSave}
                          loading={loading}
                          history={props.history}
            />
          </>
      );
    }
  };

  return form();
};