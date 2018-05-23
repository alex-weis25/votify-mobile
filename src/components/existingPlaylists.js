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

export class ExistingPlaylists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userPlaylists: [],
    };
  }

  componentDidMount = () => {
    this.findUserPlaylists();
  };

  findUserPlaylists() {
    console.log('running findUserPlayslists')
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
            console.log('found playlists: ', playlists);
            return playlists.data.items.filter(playlist => {
              const userId = this.props.userObj.id;
              if (playlist.collaborative && playlist.owner.id === userId) {
                return playlist;
              }
            });
          })
          .then(userPlaylists => {
            console.log('setting state on UserPlaylists: ', userPlaylists)
            this.setState({ userPlaylists });
          });
      })
      .catch(error => console.log("error: ", error));
  }

  render() {
    const playlists = this.state.userPlaylists;
    console.log('playslists on EP: ', this.state)
    return (
      <div id="playlist-root">
        <div id="user-playlists">
          <h3>Existing playlists:</h3>
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
                  />
                </div>
              );
            })}
        </div>
      </div>
    );
  }
}

const mapState = ({ Votify }) => ({ Votify });
const mapDispatch = { fetchVotify };

export default connect(mapState, mapDispatch)(ExistingPlaylists);
