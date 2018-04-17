import React, { Component } from "react";
import Login from "./components/login";
import { Route } from "react-router-dom";
import axios from "axios";
import { connect } from "react-redux";
import queryString from "query-string";
import {
  FindPlaylists,
  SinglePlaylist,
  ChoosePlaylist,
  SecondaryHeader,
  CreatePlaylist
} from "./components/index.js";

//Test new
import SignInCard from '../src/testJS1.jsx'


const db = firebase.firestore();
import { sortByVote } from "./functions";
import { fetchVotify, setTop } from "./store/votify.js";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userObj: {},
      accessToken: "",
      view: "choosePlaylist", //'choosePlaylist' as default
      previousViews: []
    };

    //Set top song

    setInterval(() => {
      if (this.props.Votify.votify.id) this.findHighestVote();
    }, 10000);
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

  findHighestVote = () => {
    console.log("finding highest vote");
    const setTop = this.props.setTop;
    const playlistId = this.props.Votify.votify.id;
    db
      .collection("Playlists")
      .doc(playlistId)
      .collection("Queue")
      .get()
      .then(songs => {
        const songArray = [];
        songs.forEach(item => {
          songArray.push(item.data().content);
        });
        return songArray;
      })
      .then(unsorted => {
        return sortByVote(unsorted);
      })
      .then(sorted => {
        setTop(sorted[0]);
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
          <CreatePlaylist userObj={this.state.userObj} setView={this.setView} />
        );
      case "friendsPlaylist":
        return <h2>Join playlist</h2>;
      case "SinglePlaylist":
        return (
          <SinglePlaylist
            userObj={this.state.userObj}
            setView={this.setView}
            findHighest={this.findHighestVote}
          />
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
          <div>
            <Login />
            <SignInCard />
          </div>
        ) : (
          <div className="votify-main">{this.selectComponents()}</div>
        )}
      </div>
    );
  }
}

const mapState = ({ Votify }) => ({ Votify });
const mapDispatch = { fetchVotify, setTop };

export default connect(mapState, mapDispatch)(App);
