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

export class ExistingPlaylists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userPlaylists: [],
      loading: false
    };
  }

  componentDidMount = () => {
    this.findUserPlaylists();
  };

  findUserPlaylists() {
    this.setState({ loading: true });
    Users.where("accessToken", "==", accessToken)
      .get()
      .then(user => {
        let user_id = user.docs[0].id;
        return user_id;
      })
      .then(user_id => {
        axios({
          method: "GET",
          url: `https://api.spotify.com/v1/users/${user_id}/playlists`,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
          }
        })
          .then(playlists => {
            return playlists.data.items.filter(playlist => {
              const userId = this.props.userObj.id;
              if (playlist.collaborative && playlist.owner.id === userId) {
                return playlist;
              }
            });
          })
          .then(userPlaylists => {
            this.setState({
              userPlaylists: userPlaylists,
              loading: false
            });
          });
      })
      .catch(error => console.log("error: ", error));
  }

  render() {
    const playlists = this.state.userPlaylists;
    const isLoading = this.state.loading;
    return (
      <div id="playlist-root">
        <div id="user-playlists">
          {playlists.length > 0 &&
            playlists.map(playlist => {
              return (
                <div className="playlist-item" key={playlist.id}>
                  <PlaylistSelector
                    id={playlist.id}
                    name={playlist.name}
                    userObj={this.props.userObj}
                    fetchVotify={this.props.fetchVotify}
                    setView={this.props.setView}
                    setOwner = {this.props.setOwner}
                  />
                </div>
              );
            })}
          <div id="playlist-loading">
            {isLoading ? <h3>...loading playlists...</h3> : ""}
          </div>
          <div id="playlist-empty">
          {!isLoading && !playlists.length ? <h3>Create a new playlist or use a friend's to continue!</h3> : ""}
          </div>
        </div>
      </div>
    );
  }
}

const mapState = ({ Votify }) => ({ Votify });
const mapDispatch = { fetchVotify, setOwner };

export default connect(mapState, mapDispatch)(ExistingPlaylists);
