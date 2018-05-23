import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import queryString from "query-string";

class SongList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const tracks = this.props.tracks;
    return (
      <div className="Single-playlist-tracks">
        <h2 className='indent' >Playlist - {this.props.Votify.votify.name}</h2>
        <div className='playlist-tracks-wrapper'>
          {tracks &&
            tracks.items.map(track => {
              return (
                <div className="user-tracks" key={track.id}>
                  <div className="album-art">
                    <img src={track.track.album.images[0].url} />
                  </div>
                  <div className="song-details">
                    <div className="song-title">
                      {track.track.name}
                    </div>
                    <div className="song-artist">
                      {track.track.artists[0].name}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    );
  }
}

const mapState = ({ Votify }) => ({ Votify });
const mapDispatch = null;

export default connect(mapState, mapDispatch)(SongList);
