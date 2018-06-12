import React, { Component } from "react";
import { connect } from "react-redux";
const db = firebase.firestore();
//connection to store limited

export class PlaylistSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onClick = this.onClick.bind(this);
  }

  onClick(event) {
    event.preventDefault();
    const { id, accessToken } = this.props.userObj;
    const playlistId = this.props.id;
    const playlistName = this.props.name;
    const fetchVotify = this.props.fetchVotify;
    fetchVotify(id, playlistId, accessToken);
    db.collection("Playlists")
      .doc(`${playlistId}`)
      .update({
        //set
        // owner: id, //user ID === owner ID here. CAUTION!
        // name: playlistName,
        accessToken: accessToken
      })
      .then(_ => {
        this.props.setOwner({
          accessToken: accessToken
        });
      })
      .then(_ => this.props.setView("SinglePlaylist"));
  }

  render() {
    return (
      <div className="Playlist-selector">
        <div className="Playlist-selector-left">
          <button className="button-playlist" onClick={this.onClick}>
            Select
          </button>
        </div>
        <div className="Playlist-selector-right">
          <div className="playlist-name">
            <h4>{this.props.name}</h4>
          </div>
        </div>
      </div>
    );
  }
}

const mapState = ({ Votify }) => ({ Votify });
const mapDispatch = null;

export default connect(
  mapState,
  mapDispatch
)(PlaylistSelector);
