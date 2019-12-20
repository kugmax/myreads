import React, {MouseEvent} from "react";
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {UserBookFormValues} from "../../containers/EditBook/BookFormValues";
import Button from '@material-ui/core/Button';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import {DropzoneArea} from 'material-ui-dropzone'
import {Formik, Field, Form} from 'formik';
import {
  TextField
} from 'formik-material-ui';
import {UserBook} from "../../model/UserBook";

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
  handleChange: (name: string, value: string|number) => void,
  handleSave: (book: UserBook) => Promise<void>
  handleAddFileToUpload: (files: File[]) => void,
  handleUpload: (event: MouseEvent<HTMLButtonElement>) => void,
  activeStep: number,
  loading: boolean
}

export const EditBookForm: React.FC<EditBookFormProps> = (
    {book, handleChange, handleSave, handleAddFileToUpload, handleUpload, activeStep, loading}
    ) => {

  const classes = useStyles();
  return (
      <Stepper activeStep={activeStep} orientation="vertical">
        <Step key="Save book description">
          <StepLabel>Save book description</StepLabel>
          <StepContent>
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
                                   onClick={submitForm}>Next</Button></div>
                    </Form>
                )}
            />
          </StepContent>
        </Step>

        <Step key="Upload cover">
          <StepLabel>Upload cover</StepLabel>
          <StepContent>
            <div>
              <DropzoneArea
                  acceptedFiles={["image/*"]}
                  filesLimit={1}
                  useChipsForPreview={true}
                  showAlerts={false}
                  onChange={handleAddFileToUpload}/>
            </div>
            <div><Button variant="contained" color="primary" disabled={loading} onClick={handleUpload}>Finish</Button></div>
          </StepContent>
        </Step>
      </Stepper>
  );
};