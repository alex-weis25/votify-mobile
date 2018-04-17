import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";

export const Login = props => {

  onClick = event => {
    event.preventDefault();
    window.open('../../public/popup.html', 'name', 'height=585,width=400')
  }

  return (
    <div id="login-root">
      <h3>Please login to continue</h3>
      <button onClick={this.onClick}>Login HI</button>
    </div>
  );
};

const mapState = null;
const mapDispatch = null;

export default withRouter(connect(mapState, mapDispatch)(Login));


// <a id="login-btn" href="/login">
//         Login
//       </a>
