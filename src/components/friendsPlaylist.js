import React, { Component } from "react";
import axios from "axios";
import queryString from "query-string";
import { connect } from "react-redux";
import { PlaylistSelector } from "./playlistSelector.jsx";
import { fetchVotify, setOwner } from "../store/votify.js";

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
      playlistName: "",
      password: "",
      error: false
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
    const { ownerId, playlistName, password } = this.state;
    const { fetchVotify, setView, setOwner } = this.props;
    let foundItem = false;
    console.log('playlistName', playlistName)
    db
      .collection("Playlists")
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          console.log('all dox', doc.data())
          if (doc.data().name === playlistName && doc.data().password === password) {
            foundItem = true;
            setOwner({
              accessToken: doc.data().accessToken
            })
            fetchVotify(ownerId, doc.id, accessToken);
            setView('SinglePlaylist');
          }
        });
      })
      .then(_ => {
        if(!foundItem){
            console.log('throw error')
            this.setState({
              error: true
            });
        }
      })
      .catch(error => {
        console.log("error getting docs: ", error);
        this.setState({
          error: true
        });
      });
  };

  render() {
    return (
      <div id="playlist-root">
        <div id="user-playlists">
          <form className="form-playlist" onSubmit={this.onSubmit}>
            <input
              name="playlistName"
              className="form-control"
              value={this.state.playlistName}
              onChange={this.handleChange}
              placeholder="Enter Votify Playlist Name"
            />
            <input
              name="password"
              className="form-control"
              value={this.state.password}
              onChange={this.handleChange}
              placeholder="Enter Playlist Password"
            />
            <button className="send-it-btn" type="submit">
              Submit
            </button>
          </form>
        </div>
        <div className="search-error">
          {this.state.error ? <div> incorrect playlist name and password </div> : ""}
        </div>
      </div>
    );
  }
}

const mapState = ({ Votify }) => ({ Votify });
const mapDispatch = { fetchVotify, setOwner };

export default connect(mapState, mapDispatch)(FriendsPlaylist);

// <input
//               name="ownerId"
//               className="form-control"
//               value={this.state.ownerId}
//               onChange={this.handleChange}
//               placeholder="Enter Friend's Spotify ID"
//             />
