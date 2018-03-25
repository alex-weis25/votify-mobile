import React, { Component } from "react";
import Login from "./components/login";
import { Route } from "react-router-dom";
import axios from "axios";
import { connect } from "react-redux";
import queryString from "query-string";
import Votify from "./components/votify.jsx";
import FindPlaylists from "./components/FindPlaylists.jsx";
import Search from "./components/Search.jsx";
const db = firebase.firestore();
// import "./App.css";


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: "",
      accessToken: ""
    };
  }

  componentDidMount() {
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed.access_token;
    axios
      .get("https://api.spotify.com/v1/me", {
        headers: { Authorization: "Bearer " + accessToken }
      })
      .then(response => {
        // console.log("user info:", response);
        this.setState(
          {
            loggedIn: response.data.display_name,
            accessToken
          },
          () => {
            console.log("state on app.js", this.state);
          }
        );
      });
  }

  render() {
    const Users = db.collection("Users");
    Users.get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        console.log(doc.id, " => ", doc.data());
      });
    });

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Votify</h1>
        </header>
        <p className="App-intro">Welcome to Votify</p>
        <Votify />
        <FindPlaylists />
        <Search />
      </div>
    );
  }
}

const mapState = ({ Queue, Votify }) => ({ Queue, Votify });
const mapDispatch = null;

export default connect(mapState, mapDispatch)(App);

// export const getUser
