import React, { FC, useEffect, useState } from "react";
import { Header } from './Header';
import { UserData } from '../lib/types'
import { Tester } from './Tester'
import { appClient } from "../services/appClient";

export const HomePage: FC = () => {
  const [ user, setUser ] = useState<UserData | null>(null)
  const [ photoUrl, setPhotoUrl ] = useState<string | undefined>(undefined)
  const [ authenticated, setAuthenticated ] = useState(false)

  const login = () => {
    appClient.loginSuccess()
    .then(user => {
      setUser(user)
      setAuthenticated(true)
      setPhotoUrl(user.profilePic)
    })
    .catch(error => {
      setAuthenticated(false)
    });
  }

  useEffect(login, [])

  return (
    <div>
        <Header
          authenticated={authenticated}
          handleNotAuthenticated={() => setAuthenticated(false)}
          photoUrl={photoUrl}
        />
        <div>
          {!authenticated ? (
            <h1>Welcome!</h1>
          ) : (
            <div>
              <h1>You have logged in successfully!</h1>
              <h2>Welcome {user?.displayName}!</h2>
            </div>
          )}
        </div>
        <Tester />
      </div>
  )

}
