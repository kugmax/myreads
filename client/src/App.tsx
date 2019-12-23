import React from 'react';
import './App.css';
import { Route, Switch} from 'react-router-dom'
import Auth from "./auth/Auth";
import {Books} from "./containers/Books";
import {EditBook} from "./containers/EditBook";
import {Login} from "./containers/Login";
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {SnackbarProvider} from "notistack";
import {CreateBook} from "./containers/CreateBook";

export interface AppProps {
  auth: Auth
  history: any
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      root: {
        flexGrow: 1,
        margin: 10
      }
    }),
);

export const App: React.FC<AppProps> = ( {auth, history }) => {

  const classes = useStyles();

  const generateCurrentPage = () => {
    if (!auth.isAuthenticated()) {
      return <div> Welcome </div>
    }

    return (
        <Switch>
          <Route
              path="/home"
              exact
              render={props => {
                return <Books {...props} auth={auth} />
              }}
          />
          <Route
              path="/books/create"
              exact
              render={props => {
                return <CreateBook {...props} auth={auth} />
              }}
          />
          <Route
              path="/books/:bookId/edit"
              exact
              render={props => {
                return <EditBook {...props} auth={auth} />
              }}
          />
        </Switch>
    )
  };

  return (
      <SnackbarProvider maxSnack={3}>
        <div className={classes.root}>
          <Grid container
                spacing={3}
                justify={"flex-end"}
                alignItems="flex-end">

            <Grid item xs={3}>
              <Login auth={auth}/>
            </Grid>
          </Grid>

          <Grid container
                spacing={3}
                direction={"column"}
                justify={"center"}
                alignItems="center">
            <Grid item xs={12}>
              {generateCurrentPage()}
            </Grid>
          </Grid>
        </div>
      </SnackbarProvider>
  );
};
