import React, { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LoginButton } from './components/LoginButton'
import './Main.scss'

const millPicUrl = 'https://www.svgrepo.com/show/100551/mill.svg'

export const Main: FC<{authenticated: boolean}> = (props) => {
    return (
        <div className='Main'>
            <div className='Directory'>
                {props.authenticated ? 
                    <div className='AuthDirectory'>
                        <Link className='PathLink' to='/Generator/' >
                            The Generator
                        </Link>
                        <Link className='PathLink' to='/Reorganizer/'>
                            The Re-Vibe-Inator
                        </Link>
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