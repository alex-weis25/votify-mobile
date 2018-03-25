import React, { Component } from 'react';
import axios from 'axios';
import queryString from 'query-string';

export default class Login extends Component {
  constructor(props){
    super(props)
    this.state = {
      user: ''
    }
  }

  componentDidMount() {

  }


  render() {

    return (
      <div id="login-root">
        <h2>Login</h2>
      </div>
    )
  }
}







// app.get('/login', function(req, res) {
// res.redirect('https://accounts.spotify.com/authorize?' +
//   querystring.stringify({
//     response_type: 'code',
//     client_id: process.env.SPOTIFY_CLIENT_ID,
//     scope: 'user-read-private user-read-email playlist-modify-public playlist-read-collaborative playlist-modify-private user-read-currently-playing',
//     redirect_uri
//   }))
// })

// app.get('/callback', function(req, res) {
// let code = req.query.code || null
// let authOptions = {
//   url: 'https://accounts.spotify.com/api/token',
//   form: {
//     code: code,
//     redirect_uri,
//     grant_type: 'authorization_code'
//   },
//   headers: {
//     'Authorization': 'Basic ' + (new Buffer(
//       process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
//     ).toString('base64'))
//   },
//   json: true
// }
// request.post(authOptions, function(error, response, body) {
//   var access_token = body.access_token
//   let uri = process.env.FRONTEND_URI || 'http://localhost:3000'
//   res.redirect(uri + '?access_token=' + access_token)
// })
// })
// ////
