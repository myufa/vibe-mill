import React, { Component, FC, useEffect, useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { UserData } from "./lib/types";
import { Main } from './pages'
import { Header } from "./pages/components/Header";
import { Footer } from './pages/components/Footer'
import { Generator } from "./pages/Generator";
import { Reorganizer } from "./pages/Reorganizer";
import { appClient } from "./services/appClient";
import { ProtectedRoute } from './lib/ProtectedRoute'
import './App.scss'

const App: FC = () => {
  const [ user, setUser ] = useState<UserData | null>(null)
  const [ profilePicUrl, setProfilePicUrl ] = useState<string | undefined>(undefined)
  const [ authenticated, setAuthenticated ] = useState(false)
  const [ loading, setLoading ] = useState(true)

  const login = () => {
      appClient.loginSuccess()
      .then(user => {
        setUser(user)
        setAuthenticated(true)
        setLoading(false)
        setProfilePicUrl(user.profilePic)
      })
      .catch(error => {
        setAuthenticated(false)
        setLoading(false)
      });
  }
  
  useEffect(login, [authenticated])
  return (
    <div className='App'>
      <div  className='HeaderSection'>
        <Header
            authenticated={authenticated} 
            username={user?.username} 
            profilePicUrl={profilePicUrl} 
        />
      </div>
      <Router>
        <div className='MainSection'>
          {!loading ? 
            <>
              <Route 
                exact={true} path="/" 
                render={(props) => (<Main authenticated={authenticated}/>)} 
              />
              {
                authenticated ?
                <>
                  <ProtectedRoute
                    exact={true} path="/Generator/" 
                    Comp={Generator} 
                  />
                  <ProtectedRoute
                    exact={true} path="/Reorganizer/" 
                    Comp={Reorganizer} 
                  />
                </>
                : null
              }
            </>
          :
            null
          }
          
          
        </div>
      </Router>
      <div className='FooterSection'>
          <Footer />
      </div>
    </div>
  )
  
}

export default App;