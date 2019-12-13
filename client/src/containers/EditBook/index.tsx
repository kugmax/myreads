import React, { Component } from 'react';
import Auth from "../../auth/Auth";
import { History } from 'history'

interface EditBookProps {
  auth: Auth
  history: History
}

interface EditBookState {
}

export default class EditBook extends Component<EditBookProps, EditBookState> {
  render() {
    return (
        <>EditBook container </>
    );
  }
}