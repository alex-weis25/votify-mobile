import React, { Component } from 'react';
import axios from 'axios';
import queryString from 'query-string';

export default class Votify extends Component {
  constructor(props){
    super(props)
    this.state = {
      user: ''
    }
  }

  componentDidMount() {
    fetchPlaylist();
  }


  render() {

    return (
      <div id="login-root">
        <h2>Current Playlist</h2>
      </div>
    )
  }
}

//Auth info
const user_id = "alex.weis25" || this.state.user;
const playlist_id = "0yo2PnRNNFGN4TM5vLSg7u"; //For 'votify' playlist
const parsed = queryString.parse(window.location.search);
const accessToken = parsed.access_token;

//Get user playlist
const fetchPlaylist = () => {
  axios({
    method: "GET",
    url: `https://api.spotify.com/v1/users/${user_id}/playlists/${playlist_id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization:
        `Bearer ${accessToken}`
    }
  })
  .then(res => {
    console.log('query results from spotify: ', res)
  })

}

