import express from "express";
import passport from "passport";

const app = express();
const CLIENT_HOME_PAGE_URL = "http://localhost:3000";

// when login is successful, retrieve user info
app.get("/login/success", (req, res) => {
  if (req.user) {
    res.json({
      success: true,
      message: "user has successfully authenticated",
      user: req.user,
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
  res.redirect(CLIENT_HOME_PAGE_URL);
});

// auth with spotify
app.get("/spotify", passport.authenticate("spotify"));

// redirect to home page after successfully login via spotify
app.get(
  "/spotify/redirect",
  passport.authenticate("spotify", {
    successRedirect: CLIENT_HOME_PAGE_URL,
    failureRedirect: "/auth/login/failed"
  })
);

export { app as authApp }
