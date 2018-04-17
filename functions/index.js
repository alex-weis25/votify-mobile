/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';
const functions = require('firebase-functions');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');

// Firebase Setup
const admin = require('firebase-admin');
// var serviceAccount = require('../serviceAccounts.json');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: 'https://votify-b9360.firebaseio.com'
// });

admin.initializeApp({
  credential: admin.credential.cert(
    {
    projectId: 'votify-b9360',
    clientEmail: 'firebase-adminsdk-i92aj@votify-b9360.iam.gserviceaccount.com',
    privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDFmVkqg3yJMnsa\naeHDvDh5h322iD/ijMBDRzzGYGopJMpoAEIettKMskk//hOGa0cQxc31DK0FImd0\nVIbjt7HVC/6+Now68XCnT2Xbn+/iBplWLmlgDYaDAV1GL+s1fDG+PGUsYnAQdPPg\nirxND84K9HWZ4n7/SQyw6QwpXLcTdXAPlSQ7vboB9CEukjWJukcqhY7AMjIT6Zxc\nLZemztgZp8KXG9zTkmgV5w9nSsqtdKwJl/pfXQJfpvnMxIGOmJQkPTmAvNsTgbZF\nJVsphuAwfwDxtRSagSwtwdxBvhz9ksY2lqRG1048CyGaaFAgC+Y8VpDMVFKQmZCb\nETCmtbWNAgMBAAECggEAAhJlYsfl0+McHameN45Z1z208zzYJ/jK1p8WGOG6QJEw\nBXQkkqw0ZqDt71uremgrOBai3gln0lsgfjyZUiTtxT/uyAbMD0goeBCh5Ed33UUC\nxupjVMxU1zskmQ+ikI6ApQUpbb7gfEOwVO/ky+K5CdizV6LjgFYUlHxKZ4VJ2Xcy\ng0TUSkaXE4b3+yJP4en7N+BYkKM9GtMMhNuY8H6E9/539kR1MeqvRbjg6kaG75p7\nvsy1gZetuLhNsGsyJiya2XZBxMHHeYqwxCOluxOA0bNU+LpirH/tWgHg5ce8+EZS\nXBpBHEBclOcIVlDyVM/GTDPGB8/BPOQBYlR77PFhTwKBgQD+xkt/BZBaAvgTKtXV\nEgKXCWO7vDtzWChcfdevYdlf8ZF/j2Mgrw5r/QxnWlWF0gqvxJD/txJWKMV6v3Lq\nAQFmlQtWe3Hx68iB854SHKLcXrEztUo8g/caxaya05CGyYtYjcCVBy4+jZjnM2+c\nWRk2rDrnu2LU+Jr6rw3bzQx2ywKBgQDGjKchyd+hZVr9BouBWoYHO86lAyrvY5dF\nvWJWwbblTptGyrdiCJ6dAkJL+YuS6ycrihbSjwOWBhF21do6dySsgo0DHcz3cM4D\npARibJwHWExXLeEZ8m1QNGZhqI4LbPtVKXITh+Hf1dTNDgOTRQPIOLhKaIJUb3uY\nl07swFaiBwKBgQDMwRTfqtsOXCB/VwevS+Ak/njW4jptQsZ9Pu3el6cZgo1KlTQ3\nijju9NnJHkJpYBsSk8lsmfb0o6PCOKbkBZbYmKQaBu/WW4YzWlUJfVYuATQsuGBH\nLk+jhoZnj+wxRzzkGFhT7QdvYmEmPqJOZxTqaZSVtHWDb6EuIw3iPnLr7QKBgQCl\nCUbnPBEJ6+DMz0Loe6FKo/jpio+GusaD7p6uNIjdZBCHsHrsHvQQ2E7ZLg1JSvOd\nKkQ8Myos6tBbcfjafixaxI2H2J6F0xs7RXtrgJHVPRz/niAs3Cjm8Rdk96FSd/0V\n1cR/3YPv9aLT62EnacdyB0uQdfxXSO94b9Tn0BxywwKBgBX3dvEJrtTRxvocce9O\nFf4Duq0OOueX0FWJBO/dnLnZBFb/fMT5NS28peGjOCAruIMTcRnwpivlHzGRmJ1j\nn6lmCR/KIBcLMftfLoxs+7rUkzSVj1BJyaSNvVgn02We3RAhHVOU+Xcy5XA1qR+r\nkY7+bXS4TXnN4K/Z68FKP1iZ\n-----END PRIVATE KEY-----\n"
  }
),
  databaseURL: 'https://votify-b9360.firebaseio.com'
});



// Spotify OAuth 2 setup
// TODO: Configure the `spotify.client_id` and `spotify.client_secret` Google Cloud environment variables.
const SpotifyWebApi = require('spotify-web-api-node');
const Spotify = new SpotifyWebApi({
  clientId: functions.config().spotify.client_id,
  clientSecret: functions.config().spotify.client_secret,
  redirectUri: `https://${process.env.GOOGLE_ID}.firebaseapp.com/popup.html`,
});

// Scopes to request.
const OAUTH_SCOPES = ['user-read-private', 'user-read-email', 'playlist-modify-public', 'playlist-read-collaborative', 'playlist-read-private', 'playlist-modify-private', 'user-read-currently-playing'];

/**
 * Redirects the User to the Spotify authentication consent screen. Also the 'state' cookie is set for later state
 * verification.
 */
exports.redirect = functions.https.onRequest((req, res) => {
  cookieParser()(req, res, () => {
    const state = req.cookies.state || crypto.randomBytes(20).toString('hex');
    console.log('Setting verification state:', state);
    res.cookie('state', state.toString(), {maxAge: 3600000, secure: true, httpOnly: true});
    const authorizeURL = Spotify.createAuthorizeURL(OAUTH_SCOPES, state.toString());
    res.redirect(authorizeURL);
  });
});

/**
 * Exchanges a given Spotify auth code passed in the 'code' URL query parameter for a Firebase auth token.
 * The request also needs to specify a 'state' query parameter which will be checked against the 'state' cookie.
 * The Firebase custom auth token is sent back in a JSONP callback function with function name defined by the
 * 'callback' query parameter.
 */
exports.token = functions.https.onRequest((req, res) => {
  try {
    cookieParser()(req, res, () => {
      console.log('Received verification state:', req.cookies.state);
      console.log('Received state:', req.query.state);
      if (!req.cookies.state) {
        throw new Error('State cookie not set or expired. Maybe you took too long to authorize. Please try again.');
      } else if (req.cookies.state !== req.query.state) {
        throw new Error('State validation failed');
      }
      console.log('Received auth code:', req.query.code);
      Spotify.authorizationCodeGrant(req.query.code, (error, data) => {
        if (error) {
          throw error;
        }
        console.log('Received Access Token:', data.body['access_token']);
        Spotify.setAccessToken(data.body['access_token']);

        Spotify.getMe((error, userResults) => {
          if (error) {
            throw error;
          }
          console.log('Auth code exchange result received:', userResults);
          // We have a Spotify access token and the user identity now.
          const accessToken = data.body['access_token'];
          const spotifyUserID = userResults.body['id'];
          const profilePic = userResults.body['images'][0]['url'];
          const userName = userResults.body['display_name'];
          const email = userResults.body['email'];

          // Create a Firebase account and get the Custom Auth Token.
          return createFirebaseAccount(spotifyUserID, userName, profilePic, email, accessToken).then(
              (firebaseToken) => {
                // Serve an HTML page that signs the user in and updates the user profile.
                return res.jsonp({token: firebaseToken});
              });
        });
      });
    });
  } catch (error) {
    return res.jsonp({error: error.toString});
  }
  return null;
});

/**
 * Creates a Firebase account with the given user profile and returns a custom auth token allowing
 * signing-in this account.
 * Also saves the accessToken to the datastore at /spotifyAccessToken/$uid
 *
 * @returns {Promise<string>} The Firebase custom auth token in a promise.
 */
function createFirebaseAccount(spotifyID, displayName, photoURL, email, accessToken) {
  // The UID we'll assign to the user.
  const uid = `spotify:${spotifyID}`;

  // Save the access token to the Firebase Realtime Database.
  const databaseTask = admin.database().ref(`/spotifyAccessToken/${uid}`)
  .set(accessToken);

  // Create or update the user account.
  const userCreationTask = admin.auth().updateUser(uid, {
    displayName: displayName,
    photoURL: photoURL,
    email: email,
    emailVerified: true,
  }).catch((error) => {
    // If user does not exists we create it.
    if (error.code === 'auth/user-not-found') {
      return admin.auth().createUser({
        uid: uid,
        displayName: displayName,
        photoURL: photoURL,
        email: email,
        emailVerified: true,
      });
    }
    throw error;
  });

  // Wait for all async tasks to complete, then generate and return a custom auth token.
  return Promise.all([userCreationTask, databaseTask]).then(() => {
    // Create a Firebase custom auth token.
    return admin.auth().createCustomToken(uid);
  }).then((token) => {
    console.log('Created Custom token for UID "', uid, '" Token:', token);
    return token;
  });
}
