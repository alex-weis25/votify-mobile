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

export class FindPlaylists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userPlaylists: [],
      ownerId: "",
      playlistId: "",
      playlistName: ""
    };
  }

  componentDidMount = () => {
    this.findUserPlaylists();
  };

  findUserPlaylists() {
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
            this.setState({ userPlaylists });
          });
      })
      .catch(error => console.log("error: ", error));
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
    const { ownerId, playlistId, playlistName } = this.state;
    db
      .collection("Playlists")
      .where("owner", "==", `${ownerId}`)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          console.log(doc.id, " => ", doc.data());
        });
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });
  };

  // onSubmit = event => {
  //   event.preventDefault();
  //   const { ownerId, playlistId } = this.state;
  //   axios({
  //     method: "GET",
  //     url: `https://api.spotify.com/v1/users/${ownerId}/playlists/${playlistId}`,
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${accessToken}`
  //     }
  //   }).then(playlist => {
  //     // const { ownerId, playlistId } = this.state;
  //     const playlistName = playlist.data.name;
  //     const fetchVotify = this.props.fetchVotify;
  //     fetchVotify(ownerId, playlistId, accessToken);
  //     db
  //       .collection("Playlists")
  //       .doc(`${playlistId}`)
  //       .set({
  //         owner: friendId, //user ID === owner ID here. CAUTION!
  //         name: playlistName
  //       })
  //       .then(_ => this.props.setView("SinglePlaylist"));
  //   });
  // };

  render() {
    const playlists = this.state.userPlaylists;
    return (
      <div id="playlist-root">
        <h2>Select Existing or Join Playlist!</h2>
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
              name="playlistId"
              className="form-control"
              value={this.state.playlistId}
              onChange={this.handleChange}
              placeholder="enter spotify playlist ID"
            />
            <input
              name="playlistName"
              className="form-control"
              value={this.state.playlistName}
              onChange={this.handleChange}
              placeholder="enter spotify playlist ID"
            />
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    );
  }
}

const mapState = ({ Votify }) => ({ Votify });
const mapDispatch = { fetchVotify };

export default connect(mapState, mapDispatch)(FindPlaylists);
