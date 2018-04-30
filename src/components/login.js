import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";

export const Login = props => {

  return (
    <div id="login-root">
      <h3>Please login to continue</h3>
      <a id="login-btn" href='https://us-central1-votify-b9360.cloudfunctions.net/redirect'>
        Login
      </a>
    </div>
  );
};

const mapState = null;
const mapDispatch = null;

export default withRouter(connect(mapState, mapDispatch)(Login));
