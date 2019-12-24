import React, {MouseEvent, useState} from "react";
import Auth from "../../auth/Auth";
import {History} from "history";
import {useSnackbar} from "notistack";
import {UserBook} from "../../model/UserBook";
import {getUploadUrl, saveBook, uploadFile} from "../../api/books-api";
import {EditBookForm} from "../../components/form/EditBookForm";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import Button from "@material-ui/core/Button";
import Stepper from "@material-ui/core/Stepper";
import {DropzoneArea} from "material-ui-dropzone/dist";

interface CreateBookProps {
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

export const CreateBook: React.FC<CreateBookProps> = ( props ) => {

  const { enqueueSnackbar } = useSnackbar();

  const [book, setBook] = useState(DEFAULT_BOOK);
  const [cover, setCover] = useState({} as File);
  const [bookId, setBookId] = useState('');

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);

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
      <Stepper activeStep={activeStep} orientation="vertical">
        <Step key="Save book description">
          <StepLabel>Save book description</StepLabel>
          <StepContent>
            <EditBookForm book={book} handleSave={handleSave} loading={loading} history={props.history}/>
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