import express from "express";
import passport from "passport";
import { nextTick } from "process";

const app = express();
const CLIENT_HOME_PAGE_URL = "http://localhost:3000";

// when login is successful, retrieve user info
app.get("/login/success", (req, res) => {
  console.log('success doe?')
  if (req.user) {
    res.json({
      success: true,
      message: "user has successfully authenticated",
      user: req.user,
      cookies: req.cookies
    });
  }
  console.log('REQ', req)
  console.log('REQ USER', req.user)
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
  (req, res, next) => {console.log('hit /spotify'); next()},
  passport.authenticate("spotify")
);

// redirect to home page after successfully login via spotify
app.get(
  "/spotify/redirect",
  (req, res, next) => {console.log('hit /spotify/redirect'); next()},
  passport.authenticate("spotify", {
    successRedirect: CLIENT_HOME_PAGE_URL,
    failureRedirect: "/auth/login/failed"
  }),
);

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
  console.log('REQ', req)
  res.send(result)
});

export { app as authApp }
