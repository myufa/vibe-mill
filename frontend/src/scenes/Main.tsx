import React, { FC, useEffect, useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { UserData } from "../lib/types";
import { Generator } from './Generator'
import { appClient } from "../services/appClient";
import { Header } from './components/Header'
import { LoginButton } from './components/LoginButton'
import './Main.scss'

const millPicUrl = 'https://www.svgrepo.com/show/100551/mill.svg'

export const Main: FC = () => {
    const [ user, setUser ] = useState<UserData | null>(null)
    const [ profilePicUrl, setProfilePicUrl ] = useState<string | undefined>(undefined)
    const [ authenticated, setAuthenticated ] = useState(false)

    const login = () => {
        appClient.loginSuccess()
        .then(user => {
          setUser(user)
          setAuthenticated(true)
          setProfilePicUrl(user.profilePic)
        })
        .catch(error => {
          setAuthenticated(false)
        });
    }
    
    useEffect(login, [authenticated])
    return (
        <div className='Main'>
            <div  className='HeaderSection'>
                <Header
                    authenticated={authenticated} 
                    username={user?.username} 
                    profilePicUrl={profilePicUrl} 
                />
            </div>
            <div className='Directory'>
                {authenticated ? 
                    <div className='AuthDirectory'>
                        <div className='PathLink'>
                            The Generator
                        </div>
                        <div className='PathLink'>
                            The Re-Vibe-Inator
                        </div>
                    </div> 
                :
                    <div className='NoAuthDirector'>
                        <p>
                            Generate Playlists You’ll Love
                        </p>
                        <p>
                            Reorganize Playlists By Vibe
                        </p>
                        <LoginButton/>
                    </div>
                }
                
            </div>
            <div className='mill'>
                <img src={millPicUrl} alt='vibe mill'/>
            </div>
            
        </div>
    )
}