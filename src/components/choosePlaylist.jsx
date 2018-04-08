import React, { Component } from "react";
import axios from "axios";
import queryString from "query-string";
const db = firebase.firestore();
import { PlaylistSelector } from "./playlistSelector.jsx";

const parsed = queryString.parse(window.location.search);
const accessToken = parsed.access_token;
const Users = db.collection("Users");

export default class ChoosePlaylist extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    event.preventDefault()
    const view = event.target.name;
    const setView = this.props.setView
    setView(view);
  }

  render() {
    // console.log('props on choose', this.props)
    const setView = this.props.setView;
    return (
      <div className="playlist-types">
        <button className="choose-button"
          onClick={this.handleClick}
          name="existingPlaylists"
        >
          Use existing playlist
        </button>
        <button className="choose-button" onClick={this.handleClick} name="createPlaylist">
          Create a new playlist
        </button>
        <button className="choose-button" onClick={this.handleClick} name="friendsPlaylist">
          Join a friend's playlist
        </button>
      </div>
    );
  }
}
