import React, { Component } from 'react';
import './App.css';
import { Route, Switch } from 'react-router-dom'
import Auth from "./auth/Auth";
import Books from "./containers/Books";
import EditBook from "./containers/EditBook";
import Button from '@material-ui/core/Button';

export interface AppProps {}

export interface AppProps {
  auth: Auth
  history: any
}

export interface AppState {}

export default class App extends Component<AppProps, AppState> {

  handleLogin = () => {
    this.props.auth.login()
  };

  handleLogout = () => {
    this.props.auth.logout()
  };

  render() {
    return (
        <div>
          <Button variant="contained" onClick={this.handleLogin}>Login</Button>
          <Button variant="contained" onClick={this.handleLogout}>Logout</Button>
          {this.generateCurrentPage()}}
          {/*<Segment style={{ padding: '8em 0em' }} vertical>*/}
          {/*  <Grid container stackable verticalAlign="middle">*/}
          {/*    <Grid.Row>*/}
          {/*      <Grid.Column width={16}>*/}
          {/*        <Router history={this.props.history}>*/}
          {/*          {this.generateMenu()}*/}

          {/*          {this.generateCurrentPage()}*/}
          {/*        </Router>*/}
          {/*      </Grid.Column>*/}
          {/*    </Grid.Row>*/}
          {/*  </Grid>*/}
          {/*</Segment>*/}
        </div>
    )
  }

  // generateMenu() {
  //   return (
  //       <Menu>
  //         <Menu.Item name="home">
  //           <Link to="/">Home</Link>
  //         </Menu.Item>
  //
  //         <Menu.Menu position="right">{this.logInLogOutButton()}</Menu.Menu>
  //       </Menu>
  //   )
  // }
  //
  // logInLogOutButton() {
  //   if (this.props.auth.isAuthenticated()) {
  //     return (
  //         <Menu.Item name="logout" onClick={this.handleLogout}>
  //           Log Out
  //         </Menu.Item>
  //     )
  //   } else {
  //     return (
  //         <Menu.Item name="login" onClick={this.handleLogin}>
  //           Log In
  //         </Menu.Item>
  //     )
  //   }
  // }

  generateCurrentPage() {
    // if (!this.props.auth.isAuthenticated()) {
    //   this.handleLogin();
    // }

    // if (!localStorage.getItem("isLoggedIn")) {
    //   this.handleLogin();
    // }

    console.log("this.props.auth.isAuthenticated", this.props.auth.isAuthenticated(), new Date().getTime());

    return (
        <Switch>
          <Route
              path="/"
              exact
              render={props => {
                return <Books {...props} auth={this.props.auth} />
              }}
          />

          <Route
              path="/books/:bookId/edit"
              exact
              render={props => {
                return <EditBook {...props} auth={this.props.auth} />
              }}
          />

          {/*<Route component={NotFound} />*/}
        </Switch>
    )
  }
}
