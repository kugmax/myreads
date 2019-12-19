import React, {MouseEvent} from "react";
import TextField from '@material-ui/core/TextField';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {UserBookFormValues} from "../../containers/EditBook/BookFormValues";
import Button from '@material-ui/core/Button';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import {DropzoneArea} from 'material-ui-dropzone'

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
  handleSave: (event: MouseEvent<HTMLButtonElement>) => void
  handleAddFileToUpload: (files: File[]) => void,
  handleUpload: (event: MouseEvent<HTMLButtonElement>) => void,
  activeStep: number
}

export const EditBookForm: React.FC<EditBookFormProps> = (
    {book, handleChange, handleSave, handleAddFileToUpload, handleUpload, activeStep}
    ) => {
  const classes = useStyles();
  return (
      <Stepper activeStep={activeStep} orientation="vertical">
        <Step key="Save book description">
          <StepLabel>Save book description</StepLabel>
          <StepContent>
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
              <div><Button variant="contained" color="primary" onClick={handleSave}>Next</Button></div>
            </form>
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
            <div><Button variant="contained" color="primary" onClick={handleUpload}>Finish</Button></div>
          </StepContent>
        </Step>
      </Stepper>
  );
};