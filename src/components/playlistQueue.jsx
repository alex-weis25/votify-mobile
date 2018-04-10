import React, { Component } from "react";
import { Route } from "react-router-dom";
import axios from "axios";
import { connect } from "react-redux";
import queryString from "query-string";
const db = firebase.firestore();
import { Interactive } from "./index";

//helperFunc
const sortByVote = array => {
  const updatedOrder = [];
  array.forEach(entry => {
    for (var i = 0; i < array.length; i++) {
      if (!updatedOrder[i] || entry.score >= updatedOrder[i].score) {
        updatedOrder.splice(i, 0, entry);
        break;
      }
    }
  });
  return updatedOrder;
};


class PlaylistQueue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      queue: []
    };
  }

  componentDidMount() {
    const { id } = this.props.Votify.votify;
    this.unsubscribe = db
      .collection("Playlists")
      .doc(`${id}`)
      .collection("Queue")
      .onSnapshot(snapshot => {
        let songQueue = [];
        snapshot.forEach(song => {
          songQueue.push(song.data().content);
        }),
          function(error) {
            console.log("error", error);
          };
        this.setState({
          queue: sortByVote(songQueue)
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
                <Interactive song={song} unsubscribe={this.unsubscribe} />
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
