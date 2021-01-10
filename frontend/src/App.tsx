import React, { Component, FC, useEffect, useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { UserData } from "./lib/types";
import { Main } from './scenes'
import { Header } from "./scenes/components/Header";
import { Generator } from "./scenes/Generator";
import { appClient } from "./services/appClient";

const App: FC = () => {
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
    <div>
      <div  className='HeaderSection'>
        <Header
            authenticated={authenticated} 
            username={user?.username} 
            profilePicUrl={profilePicUrl} 
        />
      </div>
      <Router>
        <div className='MainSection'>
          <Route 
            exact={true} path="/" 
            render={(props) => (<Main authenticated={authenticated}/>)} 
          />
          {authenticated ? 
            <>
              <Route 
              exact={true} path="/Generator/" 
              render={() => (<Generator />)} 
              />
            </>
            :
            null
          }
          
        </div>
      </Router>
    </div>
  )
  
}

export default App;