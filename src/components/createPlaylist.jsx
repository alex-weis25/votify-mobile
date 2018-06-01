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

  componentDidMount(){
    this.clearRedux();
  }

  clearRedux = () => {
    const getVotify = this.props.getVotify;
    getVotify([]);
  }

  newPlaylist = event => {
    event.preventDefault();
    let parsed = queryString.parse(window.location.hash);
    let accessToken = parsed.access_token;
    const userId = this.props.userObj.id;
    const getVotify = this.props.getVotify;
    const { description, name } = this.state;
    console.log('name on submit', name, userId)

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
        console.log('in chain', res.data);
        getVotify(res.data);
        return res.data;
      })
      .then(newPlay => {
        console.log('newPlay', newPlay)
        const playlistName = name;
        const playlistId = newPlay.id;
        const ownerId = userId;
        db
          .collection("Playlists")
          .doc(`${playlistId}`)
          .set({
            owner: ownerId,
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
    console.log('state on create Playlist', this.state);
  };

  render() {
    return (
      <div className="CreatePlaylist-root">
        <form className="form-playlist" onSubmit={this.newPlaylist}>
          <input
            name="name"
            className="form-control"
            value={this.state.name}
            onChange={this.handleChange}
            placeholder="Votify Playlist Name"
          />
          <input
            name="description"
            className="form-control"
            value={this.state.description}
            onChange={this.handleChange}
            placeholder="Playlist Description"
          />
          <button className="send-it-btn" type="submit">
            Submit
          </button>
        </form>
      </div>
    );
  }
}

const mapState = ({ Votify }) => ({ Votify });
const mapDispatch = { getVotify };

export default connect(mapState, mapDispatch)(CreatePlaylist);
