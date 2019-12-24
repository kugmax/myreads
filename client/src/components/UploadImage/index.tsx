import React, {ChangeEvent, useRef, useState} from "react";
import ButtonBase from "@material-ui/core/ButtonBase";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  img: {
    width: 150,
    height: 200,
    paddingLeft: "30px"
  },

}));

interface UploadImageProps {
  currentUrl: string,
  bookId: string,
  handleClick: (files: File[]) => void,
}

export const UploadImage: React.FC<UploadImageProps> = ({currentUrl, bookId, handleClick} ) => {
  const classes = useStyles();

  const inputEl = useRef(null);
  const [url, setUrl] = useState('');

  const onClick = () => {
    const obj : any = inputEl.current;
    obj.click();
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files ? e.target.files.item(0) : null;
      if (file) {
        handleClick([file]);
        setUrl(URL.createObjectURL(file));
      }
  };

  return (
      <>
        <ButtonBase>
          <input type="file" id="file" ref={inputEl} style={{display: "none"}} onChange={onChange}/>
          <img src={ url ? url : currentUrl } alt="Book cover" className={classes.img} onClick={onClick}/>
        </ButtonBase>
      </>
  );

};