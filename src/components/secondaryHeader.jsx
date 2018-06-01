import React, { Component } from "react";
import { connect } from "react-redux";
import queryString from "query-string";
import axios from "axios";
const db = firebase.firestore();

//SetTimeout
let parsed = queryString.parse(window.location.hash);
let accessToken = parsed.access_token;
import { getCurrent, fetchVotify } from "../store/votify.js";

class SecondaryHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: {},
      last: {}
    };

    //Get top rated song in queue
      //Check to see if playlist is empty, if so, add first song
      //If not empty, call function to check current vs lastSong
    setInterval(() => {
      let ownerAccessToken = this.props.Votify.owner.accessToken;

      // console.log('accessToken new', ownerAccessToken)

      axios({
        method: "GET",
        url: "https://api.spotify.com/v1/me/player/currently-playing",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ownerAccessToken}`
        }
      })
        .then(current => {
          this.props.getCurrent(current.data);
          return current.data;
        })
        .then(current => {
          this.setState({ current }, () => {
            let checkForEmpty;
            let votifyName;
            {
              this.props.Votify
                ? (checkForEmpty = this.props.Votify.votify)
                : "";
            }
            if (checkForEmpty.length !== 0) {
              votifyName = this.props.Votify.votify.name;
              if (checkForEmpty.tracks.items.length === 0) {
                console.log("signed in & empty playlist...adding first song");
                this.addSong();
              } else {
                this.addToVotify(ownerAccessToken);
              }
            }
          });
        });
    }, 10000);
  }

  addToVotify = (ownerAccessToken) => {

    const votify = this.props.Votify;
    let last;
    {
      votify.votify.tracks.items.length !== 0
        ? (last =
            votify.votify.tracks.items[votify.votify.tracks.items.length - 1]
              .track.id)
        : "";
    }
    let topSongId = "";
    {
      votify.topSong ? (topSongId = votify.topSong.songId) : "";
    }
    let current;
    {
      votify.current.item ? (current = votify.current.item.id) : "";
    }
    // console.log("in addToVotify", topSongId, current, last, ownerAccessToken, accessToken);
    try {
      if (current === last && ownerAccessToken === accessToken && topSongId) {
        this.addSong();
      } else {
        this.setState({ last }, ()  => {
          this.updatePlaylist()
        });
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  addSong = () => {
    const votify = this.props.Votify;
    let topSongId = "";
    {
      votify.topSong ? (topSongId = votify.topSong.songId) : "";
    }
    let ownerId = this.props.Votify.votify.owner.id;
    const fetchVotify = this.props.fetchVotify;
    let playlistId = votify.votify.id;
    const playlistAccessToken = votify.votify.accessToken;
    axios({
      method: "POST",
      url: `https://api.spotify.com/v1/users/${ownerId}/playlists/${playlistId}/tracks?uris=spotify%3Atrack%3A${topSongId}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    }).then(_ => {
      db
        .collection("Playlists")
        .doc(playlistId)
        .collection("Queue")
        .doc(topSongId)
        .delete()
        .then(_ => console.log("deleted"));
    })
    .then(_ => this.updatePlaylist())
  };

  updatePlaylist = () => {
    let ownerId = this.props.Votify.votify.owner.id;
    let playlistId = this.props.Votify.votify.id;
    const fetchVotify = this.props.fetchVotify;
    fetchVotify(ownerId, playlistId, accessToken);
  };

  clickBack = () => {
    const view = this.props.currentView;
    this.props.goToPreviousView();
  };

  render() {
    const nowPlaying = this.state.current;
    const lastSong = this.state.last;
    const currentView = this.props.currentView;
    return (
      <div className="votify-secondary-header">
        {this.props.userObj.displayName ? (
          <div className="secondary-top">
            <div className="secondary-top-wrapper">
              {currentView !== "choosePlaylist" ? (
                <p id="votify-back-btn" onClick={this.clickBack}>
                  Back
                </p>
              ) : (
                ""
              )}
            </div>
            <div className="secondary-top-wrapper">
              <p id="App-intro">Welcome {this.props.userObj.displayName}!</p>
            </div>
          </div>
        ) : (
          ""
        )}
        <div className="secondary-bottom" />
        {nowPlaying.is_playing ? (
          <div id="secondary-playing">
            Now playing: {nowPlaying.item.name} by{" "}
            {nowPlaying.item.artists[0].name}{" "}
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}

const MapState = ({ Votify }) => ({ Votify });
const MapDispatch = { getCurrent, fetchVotify };

export default connect(MapState, MapDispatch)(SecondaryHeader);
