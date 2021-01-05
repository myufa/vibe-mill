import { Link } from "react-router-dom";
import React, { FC } from "react";
import './Header.scss'

interface Props {
  authenticated: boolean
  photoUrl?: string | null
  handleNotAuthenticated: () => void
}

export const Header: FC<Props> = (props) => {

  const { authenticated } = props;

  const _handleSignInClick = () => {
    console.log('logging in')
    window.open("http://localhost:8080/auth/spotify", "_self");
  };

  const _handleLogoutClick = () => {
    // Set authenticated state to false in the HomePage
    window.open("http://localhost:8080/auth/logout", "_self");
    props.handleNotAuthenticated();
  };

  return (
    <div className="Header">
      {
        props.photoUrl ?
        (<img className='profile-pic' alt='user pic' src={props.photoUrl}/>) : null
      }
        <Link className='home-link' to="/">Home</Link>

      {authenticated ? (
        <button onClick={_handleLogoutClick}>Logout</button>
      ) : (
        <button onClick={_handleSignInClick}>Login</button>
      )}
    </div>
  )
}
