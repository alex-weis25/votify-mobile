import React, { Component } from "react";
import { Route } from "react-router-dom";
import axios from "axios";
import { connect } from "react-redux";
import queryString from "query-string";
const db = firebase.firestore();

import { getVotify } from "../store/votify";

class CreatePlaylist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: ""
    };
  }

  componentDidMount() {}

  componentWillUnmount() {}

  newPlaylist = event => {
    event.preventDefault();
    console.log("event details: ", event.target);
    let parsed = queryString.parse(window.location.hash);
    let accessToken = parsed.access_token;
    const userId = this.props.userObj.id;
    const getVotify = this.props.getVotify;
    const { description, name } = this.state;
    console.log("playlist data: ", userId, accessToken, description, name);
    axios({
      method: "POST",
      url: `https://api.spotify.com/v1/users/${userId}/playlists`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      },
      data: {
        name: `${name}`,
        description: `${description}`,
        collaborative: true,
        public: false
      }
    })
      .then(res => {
        console.log("newPlaylist", res);
        getVotify(res.data);
        return res.data;
      })
      .then(newPlay => {
        console.log("new play: ", newPlay);
        const playlistName = newPlay.name
        const playlistId = newPlay.id
        const ownerId = newPlay.owner.id;
        console.log('info to firebase', playlistId, playlistName, ownerId)
        db
          .collection("Playlists")
          .doc(`${playlistId}`)
          .set({
            owner: ownerId, //user ID === owner ID here. CAUTION!
            name: playlistName
          });
      })
      .then(_ => this.props.setView("SinglePlaylist"))
      .catch(err => console.log(err));
  };

  handleChange = event => {
    event.preventDefault();
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  render() {
    return (
      <div className="CreatePlaylist-root">
        <form id="create-playlist-form" onSubmit={this.newPlaylist}>
          <label>
            Playlist Name:
            <input
              name="name"
              className="form-control"
              value={this.state.name}
              onChange={this.handleChange}
              placeholder="New Votify Playlist"
            />
          </label>
          <br />
          <label>
            Description:
            <input
              name="description"
              className="form-control"
              value={this.state.description}
              onChange={this.handleChange}
              placeholder="My dope new collection of tracks"
            />
          </label>
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}

const mapState = ({ Votify }) => ({ Votify });
const mapDispatch = { getVotify };

export default connect(mapState, mapDispatch)(CreatePlaylist);
