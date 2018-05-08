// "use strict";
// const express = require("express");
// const app = express();
// const bodyParser = require("body-parser");
// const morgan = require("morgan");
// let request = require("request");
// const path = require("path");
// const location = require("location-href");
// let querystring = require('querystring')

// require("../secrets.js");

// module.exports = app;

// // logging middleware
// app.use(morgan("dev"));

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// app.use(express.static(path.join(__dirname, "../public")));

// app.use(express.static(path.join(__dirname, "../public")));

// // 404 middleware
// app.use(
//   (req, res, next) =>
//     path.extname(req.path).length > 0
//       ? res.status(404).send("Not found")
//       : next()
// );

// ///////

// var ngrok;
// var redirect_uri = "http://localhost:3000/callback"; //

// app.get("/login", function(req, res) {
//   ngrok = req.hostname + "/callback";
//   if (ngrok.slice(0, 5) !== "local") {
//     ngrok = "https://" + ngrok;
//     redirect_uri = ngrok;
//   }
//   console.log("location set", ngrok, redirect_uri);
//   res.redirect(
//     "https://accounts.spotify.com/authorize?" +
//       querystring.stringify({
//         response_type: "code",
//         client_id: process.env.SPOTIFY_CLIENT_ID,
//         scope:
//           "user-read-private user-read-email playlist-modify-public playlist-read-collaborative playlist-read-private playlist-modify-private user-read-currently-playing",
//         redirect_uri
//       })
//   );
// });

// app.get("/callback", function(req, res) {
//   let code = req.query.code || null;
//   ngrok = req.hostname;
//   redirect_uri = "https://" + ngrok + "/callback";
//   let authOptions = {
//     url: "https://accounts.spotify.com/api/token",
//     form: {
//       code: code,
//       redirect_uri,
//       grant_type: "authorization_code"
//     },
//     headers: {
//       Authorization:
//         "Basic " +
//         new Buffer(
//           process.env.SPOTIFY_CLIENT_ID +
//             ":" +
//             process.env.SPOTIFY_CLIENT_SECRET
//         ).toString("base64")
//     },
//     json: true
//   };
//   request.post(authOptions, function(error, response, body) {
//     var access_token = body.access_token;
//     ngrok = req.hostname;
//     if (ngrok.slice(0, 5) !== "local") {
//       ngrok = "https://" + ngrok;
//       redirect_uri = ngrok;
//     } else {
//       redirect_uri = "https://localhost:3000";
//     }
//     console.log("req body", ngrok);
//     let uri = redirect_uri;
//     res.redirect(uri + "?access_token=" + access_token);
//   });
// });
// ////

// app.get("*", (req, res, next) => {
//   res.sendFile(path.join(__dirname, "../public/index.html"));
// });

// const PORT = process.env.PORT || 3000;

// var server = app.listen(PORT, err => {
//   if (err) throw err;
//   console.log(`Coming in HOT on port ${PORT}`);
// });

// //Error handling
// app.use(function(err, req, res, next) {
//   console.error(err);
//   console.error(err.stack);
//   res.status(err.status || 500).send(err.message || "Internal server error.");
// });
