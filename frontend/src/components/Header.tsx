import { Link } from "react-router-dom";
// import PropTypes from "prop-types";
import React, { Component } from "react";

interface props {
  authenticated: boolean
  photoUrl?: string | null
  handleNotAuthenticated: () => void
}

export default class Header extends Component<props> {
  render() {
    const { authenticated } = this.props;
    return (
      <ul className="menu">
        {
          this.props.photoUrl ? 
          (<img alt='user pic' src={this.props.photoUrl}/>) : null
        }
        <li>
          <Link to="/">Home</Link>
        </li>
        {authenticated ? (
          <li onClick={this._handleLogoutClick}>Logout</li>
        ) : (
          <li onClick={this._handleSignInClick}>Login</li>
        )}
      </ul>
    );
  }

  _handleSignInClick = () => {
    // Authenticate using via passport api in the backend
    // Open Spotify login page
    // Upon successful login, a cookie session will be stored in the client
    window.open("http://localhost:8080/auth/spotify", "_self");
  };

  _handleLogoutClick = () => {
    // Logout using Spotify passport api
    // Set authenticated state to false in the HomePage
    window.open("http://localhost:8080/auth/logout", "_self");
    this.props.handleNotAuthenticated();
  };
}
