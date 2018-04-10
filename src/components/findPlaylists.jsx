import React, { Component } from "react";
import axios from "axios";
import queryString from "query-string";
const db = firebase.firestore();
import { PlaylistSelector } from './playlistSelector.jsx'

const parsed = queryString.parse(window.location.search);
const accessToken = parsed.access_token;
const Users = db.collection('Users')

export default class FindPlaylists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userPlaylists: []
    };
  }

  componentDidMount = () => {
    this.findUserPlaylists();
  }

  findUserPlaylists() {
    Users
      .where("accessToken", "==", accessToken)
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
            this.setState({ userPlaylists })
          })
      })
      .catch(error => console.log("error: ", error));
  };

  render() {
    const playlists = this.state.userPlaylists;
    return (
      <div id="playlist-root">
        <h2>Select Existing Playlist</h2>
        <div id="user-playlists">
        {
          playlists.length > 0 && playlists.map(playlist => {
            return (
              <div className='playlist-item' key={playlist.id}>
              <PlaylistSelector
                id={playlist.id}
                name={playlist.name}
                userObj={this.props.userObj}
                fetchVotify={this.props.fetchVotify}
                setView={this.props.setView}
              />
              </div>
            )
          })
        }
        </div>
      </div>
    );
  }
}

const playlist_id = "0yo2PnRNNFGN4TM5vLSg7u"; //For 'votify' playlist

//Sending playlist to firebase
// Users.
// .doc(user_id)
// .collection("playlists")
// .doc(playlist.id)
// .set({
//   name: playlist.name,
//   id: playlist.id
// });
