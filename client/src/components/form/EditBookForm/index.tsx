import React from "react";
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {UserBook} from "../../../model/UserBook";
import Button from "@material-ui/core/Button";

import {Formik, Field, Form} from 'formik';
import {TextField} from 'formik-material-ui';
import {UserBookFormValues} from "../../../containers/EditBook/BookFormValues";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      root: {
        '& .MuiTextField-root': {
          margin: theme.spacing(1),
          width: 200,
        },
      },
      button: {
        margin: theme.spacing(1),
      },
    }),
);

interface EditBookFormProps {
  book: UserBookFormValues,
  handleSave: (book: UserBook) => Promise<void>
  loading: boolean
}

export const EditBookForm: React.FC<EditBookFormProps> = (
    {book, handleSave, loading}
) => {
  const classes = useStyles();

  return (
      <Formik
          initialValues={{
            ...book
          }}

          validate={values => {
            const errors: Partial<any> = {};

            if (!values.title) {
              errors.title = 'Required';
            }

            if (!values.author) {
              errors.author = 'Required';
            }

            if (!values.description) {
              errors.description = 'Required';
            }

            if (!values.isbn) {
              errors.isbn = 'Required';
            }

            return errors;

          }}

          onSubmit={ async (values, {setSubmitting}) => {
            console.log("values", values);
            setSubmitting(true);
            await handleSave(values as UserBook);
            setSubmitting(false);
          }}

          render={({submitForm, isSubmitting, values, setFieldValue}) => (
              <Form className={classes.root}>
                <div>
                  <Field
                      name="title"
                      label="Title"
                      value={book.title}
                      variant="outlined"
                      component={TextField}
                  />
                </div>
                <div>
                  <Field
                      name="author"
                      label="Author"
                      value={book.author}
                      variant="outlined"
                      component={TextField}
                  />
                </div>
                <div>
                  <Field
                      name="description"
                      label="Description"
                      value={book.description}
                      variant="outlined"
                      component={TextField}
                  />
                </div>
                <div>
                  <Field
                      name="isbn"
                      label="ISBN"
                      value={book.isbn}
                      variant="outlined"
                      component={TextField}
                  />
                </div>
                <div>
                  <Field
                      name="pages"
                      label="Pages"
                      value={book.pages}
                      variant="outlined"
                      component={TextField}
                  />
                </div>
                <div><Button variant="contained"
                             color="primary"
                             disabled={loading}
                             onClick={submitForm}>Save</Button></div>
              </Form>
          )}
      />
  );

};