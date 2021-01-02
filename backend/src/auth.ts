import axios, { AxiosResponse } from "axios";
import express from "express";
import passport from "passport";
import querystring from 'querystring';
import KEYS from './config/keys'
import qs from 'qs'

const app = express();
const CLIENT_HOME_PAGE_URL = "http://localhost:3000";
const API_DOMAIN = 'http://localhost:8080'

const generateRandomString = (length: number) => {
  var text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

// when login is successful, retrieve user info
app.get("/login/success", (req, res) => {
  console.log('success doe?')
  if (req.session.user) {
    res.json({
      success: true,
      message: "user has successfully authenticated",
      user: req.session.user,
      cookies: req.cookies
    });
  }
  console.log('really doe?')
});

app.get("/login/test", (req, res) => {
  console.log('success doe?')
  if (req.user) {
    res.send({
      success: true,
      message: "user has successfully authenticated",
      user: req.user,
      cookies: req.cookies
    });
  }

  res.status(401).send({
    success: false,
    message: "user is not authenticated"
  });

  console.log('really doe?')
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
  res.redirect(CLIENT_HOME_PAGE_URL);
});

// auth with spotify
app.get(
  "/spotify",
  (req, res) => {
    console.log('hit /spotify')
    const stateKey = 'spotify_auth_state'
    const state = generateRandomString(16)
    res.cookie(stateKey, state)
    const scope = ''
    res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: KEYS.SPOTIFY_CLIENT_ID,
      //scope: scope,
      //state: state
      redirect_uri: encodeURI(API_DOMAIN + '/auth/spotify/redirect')
    }) 
    //'&redirect_uri=http:%2F%2Flocalhost:8080%2Fauth%2Fspotify%2Fredirect'
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
  let authResult: any
  try {
    authResult = await axios({
      url: "https://accounts.spotify.com/api/token",
      method: "post",
      params: {
        client_id: KEYS.SPOTIFY_CLIENT_ID,
        client_secret: KEYS.SPOTIFY_SECRET,
        code: code,
        redirect_uri: 'http://localhost:8080/auth/spotify/redirect',
        grant_type: 'authorization_code'
      },
      headers: {
        //'Authorization': 'Basic ' + (Buffer.from(KEYS.SPOTIFY_CLIENT_ID + ':' + KEYS.SPOTIFY_SECRET).toString('base64')),
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      }
    })
  } catch(err) {
      console.log(err)
  }

  req.session.authToken = authResult.data.access_token
  req.session.refreshToken = authResult.data.refresh_token
  //"https://api.spotify.com/v1/me"
  let userResult: any
  try {
    userResult = await axios({
      url: 'https://api.spotify.com/v1/me',
      method: 'get',
      headers: {
        'Authorization': 'Bearer ' + req.session.authToken
      }
    })
  } catch(err) {
      console.log(err)
  }
  req.session.user = userResult.data

  //console.log(authResult)
  console.log(req.session.authToken)
  console.log(userResult)
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
