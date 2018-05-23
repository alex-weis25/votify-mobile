import React, { Component } from "react";
import axios from "axios";
import queryString from "query-string";
import { connect } from "react-redux";
import FriendsPlaylist from "./friendsPlaylist";
import ExistingPlaylists from "./existingPlaylists";
import { PlaylistSelector } from "./playlistSelector.jsx";
import { fetchVotify } from "../store/votify.js";

const db = firebase.firestore();
let parsed = queryString.parse(window.location.hash);
let accessToken = parsed.access_token;
const Users = db.collection("Users");

export class FindPlaylists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: "Select"
    };
  }

  selectPlaylistView() {
    switch (this.state.view) {
      case "Select":
        return <div>Choose existing Playlist or Select Friend's</div>;
      case "Existing":
        return <ExistingPlaylists userObj={this.props.userObj} setView={this.props.setView} />;
      case "Friends":
        return <FriendsPlaylist setView={this.props.setView} />;
    }
  }

  setPlaylistView = event => {
    event.preventDefault();
    const view = event.target.value;
    this.setState({ view });
  };

  render() {
    return (
      <div id="playlist-root">
        <div id='FindPlaylist-btn-wrapper'>
          <button className='button-playlist' value="Existing" onClick={this.setPlaylistView}>
            Existing Playlist
          </button>
          <button className='button-playlist' value="Friends" onClick={this.setPlaylistView}>
            Friends Playlist
          </button>
        </div>
        {this.selectPlaylistView()}
      </div>
    );
  }
}

const mapState = ({ Votify }) => ({ Votify });
const mapDispatch = { fetchVotify };

export default connect(mapState, mapDispatch)(FindPlaylists);

// <input
//               name="playlistId"
//               className="form-control"
//               value={this.state.playlistId}
//               onChange={this.handleChange}
//               placeholder="enter spotify playlist ID"
//             />
