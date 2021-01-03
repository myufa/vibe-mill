import express from "express";
import querystring from 'querystring';
import KEYS from '../config/keys'
import { generateRandomString } from './authUtil'
import { spotifyClient } from './../infrastructure/spotify'

// Initialize auth app
const app = express();
const CLIENT_HOME_PAGE_URL = "http://localhost:3000";
const API_DOMAIN = 'http://localhost:8080'


// when login is successful, retrieve user info
app.get("/login/success", (req, res) => {
  console.log('hit /auth/login/success')
  if (req.session.user) {
    res.json({
      success: true,
      message: "user has successfully authenticated",
      user: req.session.user,
      cookies: req.cookies
    });
  }
});

// when login failed, send failed msg
app.get("/login/failed", (req, res) => {
  console.log('hit /auth/login/failed')
  res.status(401).json({
    success: false,
    message: "user failed to authenticate."
  });
});

// When logout, redirect to client
app.get("/logout", (req, res) => {
  console.log('hit /auth/logout')
  req.session = null
  res.redirect(CLIENT_HOME_PAGE_URL);
});

// auth with spotify
app.get("/spotify", (req, res) => {
    console.log('hit /auth/spotify')
    const stateKey = 'spotify_auth_state'
    const state = generateRandomString(16)
    res.cookie(stateKey, state)
    const scope = [
      'user-top-read',
      'user-read-recently-played',
      'playlist-modify-public',
      'playlist-read-private',
      'playlist-modify-public',
      'playlist-modify-private'
    ]
    res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: KEYS.SPOTIFY_CLIENT_ID,
        scope: scope.reduce((total, nextStr) => total + ' ' + nextStr),
        state,
        show_dialog: true,
        redirect_uri: encodeURI(API_DOMAIN + '/auth/spotify/redirect')
      })
    );
  }
);

// redirect to home page after successfully login via spotify
app.get("/spotify/redirect", async (req, res) => {
  console.log('hit /auth/spotify/redirect')
  const code = req.query.code

  // Get authentication token and refresh token by
  // posting sign-in code to spotify token endpoint
  const { authToken, refreshToken } = await spotifyClient.getAuth(code)
  req.session.authToken = authToken
  req.session.refreshToken = refreshToken

  const user = await spotifyClient.getUser(req.session.authToken)
  req.session.user = user

  res.redirect(CLIENT_HOME_PAGE_URL)
});

export { app as authApp }
