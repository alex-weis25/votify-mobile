import React, { Component } from 'react';
import axios from 'axios';
import queryString from 'query-string';
import db from '../../fire'

export default class Search extends Component {
  constructor(props){
    super(props)
    this.state = {
      search: "",
      tracks: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.onSearchClick = this.onSearchClick.bind(this);
    this.onSongAdd = this.onSongAdd.bind(this);
  }

  onSongAdd (event){
    event.preventDefault();
    const { name } = event.target;
    const addSong = this.state.tracks[name]
    const content = {
      name: addSong.name,
      artist: addSong.artist,
      songId: addSong.id,
      albumImg: addSong.albumImg
    }
    axios.post('/api/search', content)
    .then(() => {
      return socket.emit('addSong')
    })
    .then(() => {
      socket.emit('redirect')
    })
    .catch(error => console.log(error))
  }

  onSearchClick (event){
    event.preventDefault();
    const track = this.state.search.split(" ").join("+");
    const parsed = queryString.parse(window.location.search);
    const accessToken = parsed.access_token;
    let uri = "https://api.spotify.com/v1/search?q=";
    axios
      .get(`${uri}${track}&type=track`, {
        headers: { Authorization: "Bearer " + accessToken }
      })
      .then(response => {
        const tracks = response.data.tracks.items;
        // console.log("song info: ", response.data)
        this.setState({
          tracks: [
            {
              name: tracks[0].name,
              artist: tracks[0].artists[0].name,
              albumImg: tracks[0].album.images[0].url,
              id: tracks[0].id
            },
            {
              name: tracks[1].name,
              artist: tracks[1].artists[0].name,
              albumImg: tracks[1].album.images[0].url,
              id: tracks[1].id
            },
            {
              name: tracks[2].name,
              artist: tracks[2].artists[0].name,
              albumImg: tracks[2].album.images[0].url,
              id: tracks[2].id
            },
            {
              name: tracks[3].name,
              artist: tracks[3].artists[0].name,
              albumImg: tracks[3].album.images[0].url,
              id: tracks[3].id
            },{
              name: tracks[4].name,
              artist: tracks[4].artists[0].name,
              albumImg: tracks[4].album.images[0].url,
              id: tracks[4].id
            }
          ]
        });
      });
  };

  handleChange (event) {
    event.preventDefault();
    let { name, value } = event.target;
    this.setState({
      [name]: value
    });
    console.log("state on search: ", this.state)
  };

  render() {
    // console.log("props on searchBar: ", this.props);
    const currentSongs = this.state.tracks;
    return (
      <div id="search-bar">
        <form id="search-bar-form" onSubmit={this.onSearchClick}>
          <input
            name="search"
            className="form-control"
            value={this.state.search}
            onChange={this.handleChange}
            placeholder="search song by title"
          />
          <button type="submit">Submit</button>
        </form>
        <div className="playlist">
          <div className="loader">
            <div className="inner-circle" />
          </div>
        </div>
        <div id="search-items">
          {currentSongs &&
            currentSongs.map((song, index) => {
              return (
                <div>
                  <option key={song.name}>
                    <h4>
                      {song.name} by {song.artist}
                    </h4>
                  </option>
                  <button name={index} onClick={this.onSongAdd} >Add to playlist</button>
                </div>
              );
            })}
        </div>
      </div>
    );
  }
}

const user_id = "alex.weis25";
const playlist_id = "0yo2PnRNNFGN4TM5vLSg7u"; //For 'votify' playlist
const parsed = queryString.parse(window.location.search);
const accessToken = parsed.access_token;

// //Find all user playlist
// const searchSongs = () => {
//   axios({
//     method: "GET",
//     url: `https://api.spotify.com/v1/users/${user_id}/playlists`,
//     headers: {
//       "Content-Type": "application/json",
//       Authorization:
//         `Bearer ${accessToken}`
//     }
//   })
//   .then(playlists => {
//     console.log('user playlists: ', playlists.data.items)
//   })
//   .catch(error => console.log('error: ', error));
// }


