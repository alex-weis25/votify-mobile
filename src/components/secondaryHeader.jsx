import React, { Component } from "react";
import { connect } from "react-redux";
import queryString from "query-string";
import axios from "axios";

//SetTimout
let parsed = queryString.parse(window.location.search);
let accessToken = parsed.access_token;
import { getCurrent } from "../store/votify.js";




class SecondaryHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: {}
    };

    setInterval(() => {
      axios({
        method: "GET",
        url: "https://api.spotify.com/v1/me/player/currently-playing",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        }
      }).then(current => {
        this.props.getCurrent(current.data);
      });
    }, 7000);
  }


  clickBack = () => {
    const view = this.props.currentView;
    this.props.goToPreviousView();
  }

  render() {
    // this.getCurrent();
    const nowPlaying = this.state.current;
    return (
      <div className="votify-secondary-header">
        <div className="secondary-top">
          <p className="votify-back-btn" onClick={this.clickBack}>
            Back
          </p>
          <div>
            <p className="App-intro">
              Welcome {this.props.userObj.displayName}!
            </p>
          </div>
        </div>
        <div className="secondary-bottom" />
        {nowPlaying.is_playing ? (
          <div>Now playing: {nowPlaying.item.name} by</div>
        ) : (
          ""
        )}
      </div>
    );
  }
}

const MapState = ({ Queue, Votify }) => ({ Queue, Votify });
const MapDispatch = { getCurrent }

export default connect(MapState, MapDispatch)(SecondaryHeader);
