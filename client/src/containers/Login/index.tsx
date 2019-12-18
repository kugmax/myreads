import React from 'react';
import Auth from "../../auth/Auth";
import Button from "@material-ui/core/Button";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";

interface LoginProps {
  auth: Auth
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      root: {
        align: "right"
      },
    }),
);

export const Login: React.FC<LoginProps> = ( {auth }) => {

  const classes = useStyles();

  const handleLogin = () => {
    auth.login()
  };

  const handleLogout = () => {
    auth.logout()
  };

  const renderButton = () => {
    return auth.isAuthenticated() ?
        <Button variant="contained" onClick={handleLogout}>Logout</Button>
        :
        <Button variant="contained" onClick={handleLogin}>Login</Button>
  };

  return (
      <div className={classes.root}>
       {renderButton()}
     </div>
  )
};