import React, { FC, useState } from "react";
import { appClient } from '../../../services/appClient'
import './LoginButton.scss'

const spotifyLogoUrl = 'https://www.logo.wine/a/logo/Spotify/Spotify-Icon-Logo.wine.svg'

export const LoginButton: FC = () => {
    return (
        <button className='LoginButton' onClick={() => appClient.login()}>
            <div className='logo'>
                <img src={spotifyLogoUrl} alt='spotify logo'/>
            </div>
            <div className='buttontext'>
                <span>Login With Spotify</span>
            </div>            
        </button>
    )
}