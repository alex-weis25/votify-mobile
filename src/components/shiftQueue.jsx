import React, { Component } from "react";
import { Route } from "react-router-dom";
import axios from "axios";
import { connect } from "react-redux";
import queryString from "query-string";
import { sortByVote } from '../functions'

const db = firebase.firestore();

let parsed = queryString.parse(window.location.search);
let accessToken = parsed.access_token;

class ShiftQueue extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.addToVotify = () => {
      const votify = this.props.Votify;
      const last =
        votify.votify.tracks.items[votify.votify.tracks.items.length - 1].id;
      const current = votify.current.item.id;
      const userId = this.props.userObj.id;
      // const songUrl = "";
      const playlistId = votify.votify.id
      // NEED TO ADD TOP SONG NOT CURRENT...change order
      if (current === last) {
        axios({
          method: "POST",
          url: `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks?uris=spotify%3Atrack%3A${current}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
          }
        })
        .then(added => {
          console.log('added to spotify: ', added);
          db
            .collection("Playlists")
            .doc(playlistId)
            .collection('Queue')
            .get()
            .then(songs => {
              console.log('song data?', songs.data())

            })

        })
        .then(added => {
          console.log("a ", added);
          db
            .collection("Playlists")
            .doc(playlistId)
            .collection('Queue')
            .doc(current)
            .delete()
            .then(function() {
              console.log("Document successfully deleted!");
            })
            .catch(function(error) {
              console.error("Error removing document: ", error);
            });
        });
      }
    };
  }

  componentWillReceiveProps = (props, newProps) => {};

  componentWillUnmount() {}

  render() {
    console.log("props on shiftQueue", this.props);
    return <div className="ShiftQueue-root" />;
  }
}

const mapState = ({ Votify }) => ({ Votify });
const mapDispatch = {};

export default connect(mapState, mapDispatch)(ShiftQueue);
