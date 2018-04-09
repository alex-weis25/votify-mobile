import React, { Component } from "react";
import { connect } from "react-redux";
import SongList from "./songList.jsx";
import SongSearch from "./songSearch.jsx";
import PlaylistQueue from "./playlistQueue.jsx";

class SinglePlaylist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: "Playlist"
    };
    this.setPlaylistView = this.setPlaylistView.bind(this);
    this.changePlaylistView = this.changePlaylistView.bind(this);
  }

  //Fot buttons
  setPlaylistView(event) {
    event.preventDefault();
    const view = event.target.value;
    this.setState({ view });
  }

  //For props
  changePlaylistView(view) {
    this.setState({ view });
  }

  selectComponents() {
    const trackHold = this.props.Votify.votify.tracks;
    switch (this.state.view) {
      case "Playlist":
        return <SongList tracks={trackHold} />;
      case "Queue":
        return <PlaylistQueue />;
      case "Search":
        return <SongSearch changeView={this.changePlaylistView} />;
    }
  }

  render() {
    return (
      <div className="Single-playlist">
        <div className="playlist-button-wrapper">
          <div className="playlist-button">
            <button onClick={this.setPlaylistView} value="Playlist">
              Playlist
            </button>
          </div>
          <div className="playlist-button">
            <button onClick={this.setPlaylistView} value="Queue">
              Queue
            </button>
          </div>
          <div className="playlist-button">
            <button onClick={this.setPlaylistView} value="Search">
              Search
            </button>
          </div>
        </div>
        <div className="Single-playlist-components">
          {this.selectComponents()}
        </div>
      </div>
    );
  }
}

const mapState = ({ Queue, Votify }) => ({ Queue, Votify });
const mapDispatch = null;

export default connect(mapState, mapDispatch)(SinglePlaylist);
