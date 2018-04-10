import React, { Component } from "react";
import { Route } from "react-router-dom";
import axios from "axios";
import { connect } from "react-redux";
import queryString from "query-string";
import ThumbsUp from "svg-react-loader?name=Icon!../icons/thumbs-up.svg";
import ThumbsDown from "svg-react-loader?name=Icon!../icons/thumbs-down.svg";
const db = firebase.firestore();

class Interactive extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentWillUnmount() {}

  upVote = event => {
    const playlistId = this.props.Votify.votify.id;
    const Queue = db
      .collection("Playlists")
      .doc(playlistId)
      .collection("Queue");
    const songId = this.props.song.songId;

    Queue.doc(songId)
      .get()
      .then(song => {
        let newScore = +song.data().content.score + 1;
        let newUpvote = +song.data().content.upVote + 1;
        return { newScore, newUpvote };
      })
      .then(update => {
        const { newScore, newUpvote } = update;
        Queue.doc(songId).set(
          {
            content: {
              upVote: newUpvote,
              score: newScore
            }
          },
          {
            merge: true
          }
        );
      })
      .catch(error => console.log("error: ", error));
      // this.props.unsubscribe();
  };

  downVote = event => {
    const playlistId = this.props.Votify.votify.id;
    const Queue = db
      .collection("Playlists")
      .doc(playlistId)
      .collection("Queue");
    const songId = this.props.song.songId;

    Queue.doc(songId)
      .get()
      .then(song => {
        let newScore = +song.data().content.score - 1;
        let newUpvote = +song.data().content.upVote - 1;
        return { newScore, newUpvote };
      })
      .then(update => {
        const { newScore, newUpvote } = update;
        Queue.doc(songId).set(
          {
            content: {
              upVote: newUpvote,
              score: newScore
            }
          },
          {
            merge: true
          }
        );
      })
      .catch(error => console.log("error: ", error));
  };

  render() {
    const song = this.props.song;
    return (
      <div className="Interactive-root">
        <div className="thumbs-up">
          <ThumbsUp
            disabled=""
            className="vote-button-up"
            name={song.name}
            value={song.songId}
            onClick={this.upVote}
          />
        </div>
        <div className="thumbs-down">
          <ThumbsDown
            disabled=""
            className="vote-button-down"
            name={song.name}
            value={song.songId}
            onClick={this.downVote}
          />
        </div>
      </div>
    );
  }
}

const mapState = ({ Queue, Votify }) => ({ Queue, Votify });
const mapDispatch = null;

export default connect(mapState, mapDispatch)(Interactive);
