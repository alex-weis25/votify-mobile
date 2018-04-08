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
    const tracks = this.props.tracks
    return (
      <div className="Single-playlist">
        <h1>{this.props.Votify.votify.name}</h1>
        {tracks &&
          tracks.items.map(track => {
            return (
              <div className="user-tracks" key={track.id}>
                <div className="album-art">
                  <img src={track.track.album.images[0].url} />
                </div>
                <h4>{track.track.name}</h4>
                <h4>{track.track.artists[0].name}</h4>
              </div>
            );
          })}
      </div>
    );
  }
}

const mapState = ({ Queue, Votify }) => ({ Queue, Votify });
const mapDispatch = null;

export default connect(mapState, mapDispatch)(SongList);
