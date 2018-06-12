import React, { Component } from "react";
import { connect } from "react-redux";
import SongList from "./songList.jsx";
import SongSearch from "./songSearch.jsx";
import PlaylistQueue from "./playlistQueue.jsx"
import SetPassword from './setPassword';
const db = firebase.firestore();

class SinglePlaylist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: "Playlist",
      hasPassword: false
    };
  }

  //For buttons
  setPlaylistView = event => {
    event.preventDefault();
    const view = event.target.value;
    this.setState({ view });
  };

  //For props
  changePlaylistView = view => {
    this.setState({ view });
  };

  checkPassword = () => {
    const playlistId = this.props.Votify.votify.id
    let password;
    db
      .collection('Playlists')
      .doc(`${playlistId}`)
      .get()
      .then(playlist => {
        password = playlist.data().password;
        return password
      })
      .then(password => {
        if(password){
          this.setState({hasPassword: true})
        }
      })
  }

  componentDidMount(){
    this.checkPassword()
  }

  selectComponents() {
    const trackHold = this.props.Votify.votify.tracks;
    const findHighest = this.props.findHighest;
    switch (this.state.view) {
      case "Playlist":
        return <SongList tracks={trackHold} />;
      case "Queue":
        return (
          <PlaylistQueue
            userObj={this.props.userObj}
            findHighest={findHighest}
          />
        );
      case "Search":
        return <SongSearch changeView={this.changePlaylistView} />;
    }
  }

  render() {
    const playlistId = this.props.Votify.votify.id
    let hasPassword = this.state.hasPassword
    {!hasPassword && playlistId ? this.checkPassword() : ''}
    return (
      <div className="Single-playlist">
        {!hasPassword ? (
          <SetPassword setView={this.props.setView}/>
        ) : (
          <div className="Single-playlist-main">
            <div className="playlist-button-wrapper">
              <div className="playlist-button">
                <button
                  className="button-playlist"
                  onClick={this.setPlaylistView}
                  value="Playlist"
                >
                  Playlist
                </button>
              </div>
              <div className="playlist-button">
                <button
                  className="button-playlist"
                  onClick={this.setPlaylistView}
                  value="Queue"
                >
                  Queue
                </button>
              </div>
              <div className="playlist-button">
                <button
                  className="button-playlist"
                  onClick={this.setPlaylistView}
                  value="Search"
                >
                  Search
                </button>
              </div>
            </div>
            <div className="Single-playlist-components">
              {this.selectComponents()}
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapState = ({ Votify }) => ({ Votify });
const mapDispatch = null;

export default connect(
  mapState,
  mapDispatch
)(SinglePlaylist);
