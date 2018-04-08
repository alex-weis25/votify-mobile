import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import queryString from "query-string";
const db = firebase.firestore();
import ArtistSearch from './artistSearch';
import SongSearch from './songSearch';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'Song'
    };
    this.setSearchView = this.setSearchView.bind(this);
  }

  setSearchView(event) {
    event.preventDefault();
    const view = event.target.value;
    this.setState({view})
  }

  selectComponents() {
    switch (this.state.view){
      case 'Song':
      return (
        <SongSearch />
      )

      case 'Artist':
      return (
        <ArtistSearch />
      )
    }
  }

  render() {

    return (
      <div className='search-main'>
        <h1>Search</h1>
        <button onClick={this.setSearchView} value="Song">
        Song
      </button>
      <button onClick={this.setSearchView} value="Artist">
        Artist
      </button>
        {this.selectComponents()}
      </div>
    )
  }
}

const mapState = ({ Queue, Votify }) => ({ Queue, Votify });
const mapDispatch = null;

export default connect(mapState, mapDispatch)(Search);
