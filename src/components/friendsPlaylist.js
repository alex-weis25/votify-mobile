import React, { Component } from "react";
import axios from "axios";
import queryString from "query-string";
import { connect } from "react-redux";
import { PlaylistSelector } from "./playlistSelector.jsx";
import { fetchVotify } from "../store/votify.js";

const db = firebase.firestore();
let parsed = queryString.parse(window.location.hash);
let accessToken = parsed.access_token;
const Users = db.collection("Users");

export class FriendsPlaylist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ownerId: "",
      playlistId: "",
      playlistName: ""
    };
  }

  handleChange = event => {
    event.preventDefault();
    let { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  onSubmit = event => {
    event.preventDefault();
    const { ownerId, playlistName } = this.state;
    const fetchVotify = this.props.fetchVotify;
    db
      .collection("Playlists")
      .where("owner", "==", `${ownerId}`)
      .get()
      .then(function(querySnapshot) {
        querySnapshot
          .forEach(function(doc) {
            if (doc.data().name === playlistName) {
              fetchVotify(ownerId, doc.id, accessToken);
            }
          })
          .catch(function(error) {
            console.log("Error getting documents: ", error);
          });
      });
    this.props.setView("SinglePlaylist");
  };

  render() {
    return (
      <div id="playlist-root">
        <div id="user-playlists">
          <h3>Friend's playlist:</h3>
          <form id="friends-playlist" onSubmit={this.onSubmit}>
            <input
              name="ownerId"
              className="form-control"
              value={this.state.ownerId}
              onChange={this.handleChange}
              placeholder="enter friends spotify ID"
            />
            <input
              name="playlistName"
              className="form-control"
              value={this.state.playlistName}
              onChange={this.handleChange}
              placeholder="enter votify playlist name"
            />
            <button className='sent-it-btn' type="submit">Submit</button>
          </form>
        </div>
      </div>
    );
  }
}

const mapState = ({ Votify }) => ({ Votify });
const mapDispatch = { fetchVotify };

export default connect(mapState, mapDispatch)(FriendsPlaylist);
