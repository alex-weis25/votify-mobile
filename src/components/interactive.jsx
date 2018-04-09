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

  onClick = event => {
    event.preventDefault();
    console.log("clicked vote");
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
            value="1"
            onClick={this.onClick}
          />
        </div>
        <div className="thumbs-down">
          <ThumbsDown
            disabled=""
            className="vote-button-down"
            name={song.name}
            value="-1"
            onClick={this.onClick}
          />
        </div>
      </div>
    );
  }
}

const mapState = ({ Queue, Votify }) => ({ Queue, Votify });
const mapDispatch = null;

export default connect(mapState, mapDispatch)(Interactive);
