import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";

export const SignInCard = props => {
  return (
    <div
      id="demo-signed-out-card"
      className="mdl-card mdl-shadow--2dp mdl-cell"
    >
      <div class="mdl-card__supporting-text mdl-color-text--grey-600">
        <button
          id="demo-sign-in-button"
          className="mdl-color-text--grey-700 mdl-button--raised mdl-button mdl-js-button mdl-js-ripple-effect"
        />
      </div>
    </div>
  );
};

const mapState = null;
const mapDispatch = null;

export default withRouter(connect(mapState, mapDispatch)(SignInCard));

// <a id="login-btn" href="/login">
//         Login
//       </a>
