import React, { Component } from "react";
import axios from "axios";
import queryString from "query-string";
const db = firebase.firestore();
import { PlaylistSelector } from "./playlistSelector.jsx";
import SpotifyLogo from "svg-react-loader?name=Icon!../icons/spot.svg";

let parsed = queryString.parse(window.location.hash);
let accessToken = parsed.access_token;
const Users = db.collection("Users");

export default class ChoosePlaylist extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleClick = event => {
    event.preventDefault();
    const view = event.target.name;
    const setView = this.props.setView;
    setView(view);
  };

  render() {
    // console.log('props on choose', this.props)
    const setView = this.props.setView;
    return (
      <div className="playlist-types">
        <div className="spotify-logo">
          <SpotifyLogo />
        </div>
        <div className="choose-button-wrapper">
          <button
            className="choose-button"
            onClick={this.handleClick}
            name="existingPlaylists"
          >
            Use existing playlist or join a friend's
          </button>
          <button
            className="choose-button"
            onClick={this.handleClick}
            name="createPlaylist"
          >
            Create a new playlist
          </button>
          <button
            className="choose-button"
            onClick={this.handleClick}
            name="friendsPlaylist"
          >
            Join a friend's playlist
          </button>
        </div>
      </div>
    );
  }
}
