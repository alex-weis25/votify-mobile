import React, { Component } from 'react';
import axios from 'axios';
import queryString from 'query-string';

export default class CreatePlaylist extends Component {
  constructor(props){
    super(props)
    this.state = {
      user: ''
    }
  }

  componentDidMount() {
    createPlaylist();
  }


  render() {

    return (
      <div id="login-root">
        <h2>Login</h2>
      </div>
    )
  }
}

const user_id = "alex.weis25";
const playlist_id = "0yo2PnRNNFGN4TM5vLSg7u"; //For 'votify' playlist
const parsed = queryString.parse(window.location.search);
const accessToken = parsed.access_token;

//Find all user playlist
const findUserPlaylists = () => {
  console.log('accessToken: ', accessToken);
  axios({
    method: "GET",
    url: `https://api.spotify.com/v1/users/${user_id}/playlists`,
    headers: {
      "Content-Type": "application/json",
      Authorization:
        `Bearer ${accessToken}`
    }
  })
  .then(playlists => {
    return playlists.data.items;
  })
  .catch(error => console.log('error: ', error));

}


