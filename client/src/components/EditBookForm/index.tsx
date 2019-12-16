import React, {useState} from "react";
import TextField from '@material-ui/core/TextField';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {UserBookFormValues} from "../../containers/EditBook/BookFormValues";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      root: {
        '& .MuiTextField-root': {
          margin: theme.spacing(1),
          width: 200,
        },
      },
    }),
);

interface EditBookFormProps {
  book: UserBookFormValues,
  handleChange: (name: string, value: string|number) => void
}

export const EditBookForm: React.FC<EditBookFormProps> = ( {book, handleChange} ) => {
  const classes = useStyles();

  return (
      <form className={classes.root} noValidate autoComplete="off">
        <div>
          <TextField
              id="title"
              label="Title"
              value={book.title}
              onChange={event => handleChange("title", event.target.value)}
              variant="outlined"
          />
        </div>
        <div>
          <TextField
              id="author"
              label="Author"
              value={book.author}
              onChange={event => handleChange("author", event.target.value)}
              variant="outlined"
          />
        </div>
        <div>
          <TextField
              id="description"
              label="Description"
              value={book.description}
              onChange={event => handleChange("description", event.target.value)}
              variant="outlined"
          />
        </div>
        <div>
          <TextField
              id="isbn"
              label="ISBN"
              value={book.isbn}
              onChange={event => handleChange("isbn", event.target.value)}
              variant="outlined"
          />
        </div>
        <div>
          <TextField
              id="pages"
              label="Pages"
              value={book.pages}
              onChange={event => handleChange("pages", event.target.value)}
              variant="outlined"
          />
        </div>
      {/*  TODO: add submit*/}
      </form>
  );
};