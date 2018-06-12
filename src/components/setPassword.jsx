import React, { Component } from "react";
import { connect } from "react-redux";
import { checkPassword, setPassword } from "../functions.jsx";
const db = firebase.firestore();

class SetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: ""
    };
  }

  newPassword = event => {
    event.preventDefault();
    const playlistName = this.props.Votify.votify.name;
    const playlistId = this.props.Votify.votify.id;
    const password = this.state.password;
    const setView = this.props.setView
    db.collection("Playlists")
      .doc(`${playlistId}`)
      .update({
        password: password
      })
      .then(_ => setView('SinglePlaylist'))
  };

  handleChange = event => {
    event.preventDefault();
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  render() {
    const hasPassword = this.props.Votify.votify.password;
    return (
      <div className="Set-Password">
        <form className="form-playlist" onSubmit={this.newPassword}>
          <input
            name="password"
            className="form-control"
            value={this.state.password}
            onChange={this.handleChange}
            placeholder="Playlist password"
          />
          <button className="send-it-btn" type="submit">
            Submit
          </button>
        </form>
      </div>
    );
  }
}

const mapState = ({ Votify }) => ({ Votify });
const mapDispatch = null;

export default connect(
  mapState,
  mapDispatch
)(SetPassword);
