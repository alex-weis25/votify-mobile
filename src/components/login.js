import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";

export const Login = props => {
  const { handleLogin } = props

  return (
    <div id="login">
      <h3>Please login to continue</h3>
      <a id="login-btn" className="choose-button" href="https://us-central1-votify-b9360.cloudfunctions.net/login">
        Login
      </a>
    </div>
  );
};

const mapState = null;
const mapDispatch = null;

export default withRouter(connect(mapState, mapDispatch)(Login));


