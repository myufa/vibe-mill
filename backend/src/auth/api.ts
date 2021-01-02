import axios, { AxiosResponse } from "axios";
import express from "express";
import passport from "passport";
import querystring from 'querystring';
import KEYS from '../config/keys'
import qs from 'qs'
import { generateRandomString } from './authUtil'
import { spotifyClient } from './../infrastructure/spotify'

const app = express();
const CLIENT_HOME_PAGE_URL = "http://localhost:3000";
const API_DOMAIN = 'http://localhost:8080'

// when login is successful, retrieve user info
app.get("/login/success", (req, res) => {
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
  res.status(401).json({
    success: false,
    message: "user failed to authenticate."
  });
});

// When logout, redirect to client
app.get("/logout", (req, res) => {
  req.logout();
  req.session.authToken = null
  req.session.refreshToken = null
  req.session.user = null
  res.redirect(CLIENT_HOME_PAGE_URL);
});

// auth with spotify
app.get("/spotify", (req, res) => {
    console.log('hit /spotify')
    const stateKey = 'spotify_auth_state'
    const state = generateRandomString(16)
    res.cookie(stateKey, state)
    const scope = 'user-top-read user-read-recently-played playlist-modify-public playlist-read-private'
    res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: KEYS.SPOTIFY_CLIENT_ID,
        scope: scope,
        //state: state
        redirect_uri: encodeURI(API_DOMAIN + '/auth/spotify/redirect')
      }) 
    );
  }
);

// redirect to home page after successfully login via spotify
app.get("/spotify/redirect", async (req, res) => {
  console.log('hit /spotify/redirect')
  const code = req.query.code
  const spotifyTokenUrl = 'https://accounts.spotify.com/api/token'
  const authOptions = {
    form: {
      code: code,
      redirect_uri: CLIENT_HOME_PAGE_URL + '/',
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(KEYS.SPOTIFY_CLIENT_ID + ':' + KEYS.SPOTIFY_SECRET).toString('base64'))
    },
    json: true
  };

  const { authToken, refreshToken } = await spotifyClient.getAuth(code)

  req.session.authToken = authToken
  req.session.refreshToken = refreshToken

  const user = await spotifyClient.getUser(req.session.authToken)
  req.session.user = user

  console.log(user)
  res.redirect(CLIENT_HOME_PAGE_URL)
});

app.get("/sessiontest", (req, res) => {
  let result = {
    authToken: 'dud',
    refreshToken: 'dud'
  }
  if(req.session && req.session.authToken){
    result = {
      authToken: req.session.authToken,
      refreshToken: req.session.refreshToken
    }
  }
  res.send(result)
});

export { app as authApp }
