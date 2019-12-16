import React, { Component } from 'react';
import Auth from "../../auth/Auth";
import Button from "@material-ui/core/Button";

interface LoginProps {
  auth: Auth
}

interface LoginState {}

export default class Login extends Component<LoginProps, LoginState> {

  handleLogin = () => {
    this.props.auth.login()
  };

  handleLogout = () => {
    this.props.auth.logout()
  };

  render() {
    if (this.props.auth.isAuthenticated()) {
      return (
          <Button variant="contained" onClick={this.handleLogout}>Logout</Button>
      )
    } else {
      return (
          <Button variant="contained" onClick={this.handleLogin}>Login</Button>
      )
    }
  }
};