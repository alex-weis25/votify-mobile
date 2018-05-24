import React, { Component } from "react";
import { connect } from "react-redux";
import queryString from "query-string";
import axios from "axios";
const db = firebase.firestore();

//SetTimout
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

    setInterval(() => {
      axios({
        method: "GET",
        url: "https://api.spotify.com/v1/me/player/currently-playing",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
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
                this.addToVotify();
              }
            }
          });
        });
    }, 10000);
  }

  addToVotify = () => {
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
    try {
      if (current === last && topSongId) {
        console.log("calling add song");
        this.addSong();
      } else {
        this.setState({ last });
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
    const playlistId = votify.votify.id;

    console.log("on last song shifting queue");
    axios({
      method: "POST",
      url: `https://api.spotify.com/v1/users/${ownerId}/playlists/${playlistId}/tracks?uris=spotify%3Atrack%3A${topSongId}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then(_ => {
        db
          .collection("Playlists")
          .doc(playlistId)
          .collection("Queue")
          .doc(topSongId)
          .delete()
          .then(_ => console.log("deleted"));
      })
      .then(_ => {
        console.log("updating redux for addition");
        fetchVotify(ownerId, playlistId, accessToken);
      });
  };

  clickBack = () => {
    const view = this.props.currentView;
    this.props.goToPreviousView();
  };

  render() {
    const nowPlaying = this.state.current;
    const lastSong = this.state.last;
    return (
      <div className="votify-secondary-header">
        {this.props.userObj.id ? (
          <div className="secondary-top">
            <p id="votify-back-btn" onClick={this.clickBack}>
              Back
            </p>
            <p id="App-intro">Welcome {this.props.userObj.id}!</p>
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
