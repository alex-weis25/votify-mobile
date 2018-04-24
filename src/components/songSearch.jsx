import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import queryString from "query-string";
const db = firebase.firestore();

export class SongSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      tracks: [],
      exists: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.onSearchClick = this.onSearchClick.bind(this);
    this.onSongAdd = this.onSongAdd.bind(this);
    this.moreSongs = this.moreSongs.bind(this);
  }

  async onSongAdd(event) {
    event.preventDefault();
    const playlist = this.props.Votify.votify;
    const { name } = event.target;
    const addSong = this.state.tracks[name];
    const content = {
      name: addSong.name,
      artist: addSong.artist,
      songId: addSong.id,
      albumImg: addSong.albumImg,
      upVote: 0,
      downVote: 0,
      score: 0,
      voted: {}
    };

    await db
      .collection("Playlists")
      .doc(`${playlist.id}`)
      .collection("Queue")
      .doc(`${addSong.id}`)
      .get()
      .then(doc => {
        if (doc.exists) {
          this.setState({ exists: true });
        }
      });

    if (this.state.exists) {
      console.log("song already in queue");
    } else {
      await db
        .collection("Playlists")
        .doc(`${playlist.id}`)
        .collection("Queue")
        .doc(`${addSong.id}`)
        .set({ content })
        .catch(error => console.log(error));
        this.setState({exists: false}, _ => {
        const { changeView } = this.props;
        changeView("Queue");
      })
    }
  }

  onSearchClick(event) {
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
            },
            {
              name: tracks[4].name,
              artist: tracks[4].artists[0].name,
              albumImg: tracks[4].album.images[0].url,
              id: tracks[4].id
            }
          ]
        });
      });
  }

  moreSongs(event) {
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
        this.setState({
          tracks: [
            {
              name: tracks[5].name,
              artist: tracks[5].artists[0].name,
              albumImg: tracks[5].album.images[0].url,
              id: tracks[5].id
            },
            {
              name: tracks[6].name,
              artist: tracks[6].artists[0].name,
              albumImg: tracks[6].album.images[0].url,
              id: tracks[6].id
            },
            {
              name: tracks[7].name,
              artist: tracks[7].artists[0].name,
              albumImg: tracks[7].album.images[0].url,
              id: tracks[7].id
            },
            {
              name: tracks[8].name,
              artist: tracks[8].artists[0].name,
              albumImg: tracks[8].album.images[0].url,
              id: tracks[8].id
            },
            {
              name: tracks[9].name,
              artist: tracks[9].artists[0].name,
              albumImg: tracks[9].album.images[0].url,
              id: tracks[9].id
            }
          ]
        });
      });
  }

  handleChange(event) {
    event.preventDefault();
    this.setState({exists: false});
    let { name, value } = event.target;
    this.setState({
      [name]: value
    });
  }

  render() {
    const currentSongs = this.state.tracks;
    return (
      <div id="search-bar">
      <h2>Search</h2>
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
        {
          this.state.exists === true ? (<div className='warning'>Song already in queue</div>) : ''
        }
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
                  <div key={song.name}>
                    {song.name} by {song.artist}
                  </div>
                  <button name={index} onClick={this.onSongAdd}>
                    Add to playlist
                  </button>
                </div>
              );
            })}
        </div>
        <button onClick={this.moreSongs}>More</button>
      </div>
    );
  }
}

const mapState = ({ Votify }) => ({ Votify });
const mapDispatch = null;

export default connect(mapState, mapDispatch)(SongSearch);
