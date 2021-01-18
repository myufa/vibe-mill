import React, { FC, useState } from "react";
import { Redirect } from "react-router-dom";
import { appClient } from '../../../services/appClient'
import './Header.scss'

export const Header: FC<{
    authenticated: boolean, 
    username?: string,
    profilePicUrl?: string,
}> = (props) => {
    return (
        <div className='Header'>
            {props.authenticated? 
                <>
                <span className='username'>Hi {props.username}!</span>
                <div className='logout'>
                    <button onClick={() => appClient.logout()}>Log Out</button>
                </div>
                <div className='profilePic'>
                    <img src={props.profilePicUrl} alt={props.username}/>
                </div>
                </>
                :   
                null
            }
            <span className='Title' onClick={()=>window.location.href='/'}
            >The Vibe Mill</span>
        </div>
    )
}