import React, { FC, useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { appClient } from '../services/appClient';

export const ProtectedRoute: FC<{
    Comp: any, 
    path: string,
    exact: boolean,
    routeProps?: any
}> = ({Comp, path, exact, ...routeProps}) => {
    const [ authenticated, setAuthenticated ] = useState(false)
    const [ loading, setLoading ] = useState(true)
    useEffect(() => {
        appClient.loginSuccess().then(user => {
            if (user) {
                setAuthenticated(true)
                setLoading(false)
            }
        })
        .catch(err => {
            setAuthenticated(false)
            setLoading(false)
            console.log("not authed, not loading", authenticated, loading)
        })
    }, [path])

    return (
        <Route 
            path={path}
            exact={exact}
            {...routeProps}
            render={()=>{
                return !loading ? 
                authenticated ? 
                        <Comp {...routeProps} />
                    :
                        <Redirect to='/' />
                : null
            }}
        /> 
    )

}