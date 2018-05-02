import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";

export const Login = props => {

  onClick = event => {
    event.preventDefault();
    axios.get('https://us-central1-votify-b9360.cloudfunctions.net/redirect')
    .then(data => {
      console.log('ran cloud function, data: ', data)
    })
    .catch(error => console.log(error))
  }

  return (
    <div id="login-root">
      <h3>Please login to continue</h3>
      <button id="login-btn" onClick={onClick}>
        Login
      </button>
    </div>
  );
};

const mapState = null;
const mapDispatch = null;

export default withRouter(connect(mapState, mapDispatch)(Login));
