import React, { Component } from 'react';
import './App.css';
import { Route, Switch} from 'react-router-dom'
import Auth from "./auth/Auth";
import Books from "./containers/Books";
import {EditBook} from "./containers/EditBook";
import Login from "./containers/Login";

export interface AppProps {
  auth: Auth
  history: any
}

export interface AppState {}

export default class App extends Component<AppProps, AppState> {
  render() {
    return (
        <div>
          <Login auth={this.props.auth}/>
          {this.generateCurrentPage()}
        </div>
    )
  }

  generateCurrentPage() {
    if (!this.props.auth.isAuthenticated()) {
      return <div> Welcome </div>
    }

    return (
        <Switch>
          <Route
              path="/home"
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
        </Switch>
    )
  }
}
