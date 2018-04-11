import React, { Component } from "react";
import Login from "./components/login";
import { Route } from "react-router-dom";
import axios from "axios";
import { connect } from "react-redux";
import queryString from "query-string";
import {
  Votify,
  FindPlaylists,
  SinglePlaylist,
  ChoosePlaylist,
  SecondaryHeader,
  CreatePlaylist
} from "./components/index.js";
const db = firebase.firestore();

import { fetchVotify } from "./store/votify.js";




class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userObj: {},
      accessToken: "",
      view: "choosePlaylist", //'choosePlaylist' as default
      previousViews: []
    };
  }

  componentDidMount = () => {
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed.access_token;
    axios
      .get("https://api.spotify.com/v1/me", {
        headers: { Authorization: "Bearer " + accessToken }
      })
      .then(response => {
        const userObj = {
          email: response.data.email,
          id: response.data.id,
          displayName: response.data.display_name,
          accessToken: accessToken
        };
        this.setState({
          userObj,
          accessToken
        });
        return userObj;
      })
      .then(userObj => {
        db
          .collection("Users")
          .doc(userObj.id)
          .set(userObj)
          .then(() => console.log("updated user"))
          .catch(err => console.log("error: ", err));
      });
  };

  setView = view => {
    const lastView = this.state.view;
    const newPreviousViews = [...this.state.previousViews, lastView];
    this.setState({
      view,
      previousViews: newPreviousViews
    });
  };

  goToPreviousView = () => {
    const lastView = this.state.previousViews[
      this.state.previousViews.length - 1
    ];
    this.setState({
      view: lastView,
      previousViews: this.state.previousViews.slice(0, -1)
    });
  };

  selectComponents() {
    switch (this.state.view) {
      case "choosePlaylist":
        return <ChoosePlaylist setView={this.setView} />;
      case "existingPlaylists":
        return (
          <FindPlaylists
            setView={this.setView}
            userObj={this.state.userObj}
            fetchVotify={this.props.fetchVotify}
          />
        );
      case "createPlaylist":
        return (
          <CreatePlaylist userObj={this.state.userObj} setView={this.setView}/>
        )
      case "friendsPlaylist":
        return <h2>Join playlist</h2>;
      case "SinglePlaylist":
        return (
          <SinglePlaylist userObj={this.state.userObj} setView={this.setView} />
        );
    }
  }

  render() {
    return (
      <div className="App">
          <header className="App-header">
            <h1 className="App-title">Votify</h1>
          </header>
          <SecondaryHeader
            userObj={this.state.userObj}
            setView={this.setView}
            goToPreviousView={this.goToPreviousView}
          />

        {!this.state.accessToken ? (
          <Login />
        ) : (
            <div className="votify-main">{this.selectComponents()}</div>
        )}
      </div>
    );
  }
}

const mapState = ({ Queue, Votify }) => ({ Queue, Votify });
const mapDispatch = { fetchVotify };

export default connect(mapState, mapDispatch)(App);
