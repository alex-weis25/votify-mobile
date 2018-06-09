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
      password: ""
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
    const { password, name } = this.state;

    axios({
      method: "POST",
      url: `https://api.spotify.com/v1/users/${userId}/playlists`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      },
      data: {
        name: `${name}`,
        collaborative: true,
        public: false
      }
    })
      .then(res => {
        let newResData = {...res.data, password: password}
        getVotify(newResData);
        return newResData;
      })
      .then(newPlay => {
        console.log('new play: ', newPlay)
        const playlistName = name;
        const playlistId = newPlay.id;
        const ownerId = userId;
        console.log('creating playlist password:', password)
        db
          .collection("Playlists")
          .doc(`${playlistId}`)
          .set({
            owner: ownerId,
            accessToken: accessToken,
            name: playlistName,
            password: password
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
        <form className="form-playlist" onSubmit={this.newPlaylist}>
          <input
            name="name"
            className="form-control"
            value={this.state.name}
            onChange={this.handleChange}
            placeholder="Votify Playlist Name"
          />
          <input
            name="password"
            className="form-control"
            value={this.state.password}
            onChange={this.handleChange}
            placeholder="Playlist password"
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
