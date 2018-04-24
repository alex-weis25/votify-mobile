'use strict'
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
let request = require('request')
let querystring = require('querystring')
const path = require('path');
const location = require('location-href');

// const db = require('./db/index.js');
// const socketio = require('socket.io');
require('../secrets.js')

module.exports = app;

// logging middleware
app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, '../public')));

// app.use('/api', require('./api'));

// 404 middleware
app.use((req, res, next) =>
path.extname(req.path).length > 0 ?
  res.status(404).send('Not found') :
  next()
);


///////

var ngrok;
var redirect_uri = 'http://localhost:3000/callback' //


app.get('/login', function(req, res) {
  ngrok = req.hostname;
  redirect_uri = 'https://' + ngrok + '/callback'
  console.log('location set', ngrok, redirect_uri)
res.redirect('https://accounts.spotify.com/authorize?' +
  querystring.stringify({
    response_type: 'code',
    client_id: process.env.SPOTIFY_CLIENT_ID,
    scope: 'user-read-private user-read-email playlist-modify-public playlist-read-collaborative playlist-read-private playlist-modify-private user-read-currently-playing',
    redirect_uri
  }))
})

app.get('/callback', function(req, res) {
let code = req.query.code || null
ngrok = req.hostname;
redirect_uri = 'https://' + ngrok + '/callback'
let authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  form: {
    code: code,
    redirect_uri,
    grant_type: 'authorization_code'
  },
  headers: {
    'Authorization': 'Basic ' + (new Buffer(
      process.env.SPOTIFY_CLIENT_ID+ ':' + process.env.SPOTIFY_CLIENT_SECRET
    ).toString('base64'))
  },
  json: true
}
request.post(authOptions, function(error, response, body) {
  var access_token = body.access_token
  ngrok = req.hostname;
  let ngrokUri;
  ngrok ? ngrokUri = 'https://' + ngrok : ''
  console.log('req body', ngrokUri)
  let uri = ngrokUri || 'http://localhost:3000'
  res.redirect(uri + '?access_token=' + access_token)
})
})
////

app.get('*', (req, res, next) => {
  res.sendFile(path.join(__dirname, "../public/index.html"))
});

const PORT = process.env.PORT || 3000;


var server = app.listen(PORT, (err) => {
  if(err) throw err;
  console.log(`Coming in HOT on port ${PORT}`);
});

// //Sync db then start server
// db.sync().then(() => {
//   console.log("syncing database...")
// })

// //Sockets
// const io = socketio(server)

// io.on('connection', (socket) => {
//   console.log(`${socket.id} has joined the party!`)

//   socket.on('addSong', () => {
//     console.log('addSong server socket')
//     socket.broadcast.emit('newQueue')
//   })

//   socket.on('redirect', () => {
//     console.log('redirect server socket')
//     socket.emit('newQueue')
//   })

//   socket.on('voted', () => {
//     console.log('in voted server socket')
//     socket.emit('newQueue')
//     socket.broadcast.emit('newQueue')
//   })

//   socket.on('newVotify', () => {
//     console.log('in voted server socket')
//     socket.emit('addVotify')
//     socket.broadcast.emit('addVotify');
//   })

//   socket.on('disconnect', socket => {
//     console.log(`Hate to see you leave ${socket.id}`)
//   })
// })

//Error handling
app.use(function (err, req, res, next) {
  console.error(err);
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || 'Internal server error.');
});

