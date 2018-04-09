import React, { Component } from "react";
import { Route } from "react-router-dom";
import axios from "axios";
import { connect } from "react-redux";
import queryString from "query-string";
const db = firebase.firestore();
import { Interactive } from "./index";

class PlaylistQueue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      queue: []
    };
  }

  componentDidMount() {
    const { id } = this.props.Votify.votify;
    let songQueue = [];
    this.unsubscribe = db
      .collection("Playlists")
      .doc(`${id}`)
      .collection("Queue")
      .onSnapshot(snapshot => {
        snapshot.forEach(song => {
          songQueue.push(song.data().content);
        }),
          function(error) {
            console.log("error", error);
          };
        this.setState({
          queue: songQueue
        });
      });
  }

  componentWillUnmount() {
    console.log("unmounting");
    this.unsubscribe();
  }

  render() {
    const songList = this.state.queue;
    return (
      <div className="Playlist-Queue">
        <h2>Queue</h2>
        {songList &&
          songList.map(song => {
            return (
              <div className="queue-item">
                <Interactive song={song} />
                <div className="album-art">
                  <img src={song.albumImg} />
                </div>
                <div className="song-details" key={song.id} name={song.name}>
                  <div>{song.name} </div>
                  <div>{song.artist} </div>
                  <div> votes: {song.score} </div>
                </div>
              </div>
            );
          })}
      </div>
    );
  }
}

const mapState = ({ Queue, Votify }) => ({ Queue, Votify });
const mapDispatch = null;

export default connect(mapState, mapDispatch)(PlaylistQueue);
