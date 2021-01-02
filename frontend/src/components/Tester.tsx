import React, { Component } from "react";
import axios from 'axios';
//import { User } from './../types'

const baseUrl = 'http://localhost:8080'
  
interface state {
    open: boolean
    sessiontest: {authToken: string, refreshToken: string}
}

export class Tester extends Component<{}, state> {
    state: state

    constructor() {
        super({})
        this.state = {
            open: false,
            sessiontest: {authToken: '', refreshToken: ''}
        }

        this.handleOpen = this.handleOpen.bind(this)
        this.sessiontest = this.sessiontest.bind(this)
    }

    handleOpen() {
        this.setState({open: !this.state.open})
    }

    async componentDidMount(){
        await this.sessiontest()
    }

    async sessiontest(){
        const path = '/auth/sessiontest'
        await axios.get(baseUrl + path)
        .then(res=>{
            const { authToken, refreshToken } = res.data
            console.log('authToken', authToken)
            const sessiontest = {
                authToken: authToken,
                refreshToken: refreshToken
            }
            this.setState({sessiontest: sessiontest})
        })
        .catch((err)=> console.log(err))
    }

    render() {
        return (
            <div>
                <button onClick={this.handleOpen}>
                    {!this.state.open ? 'open' : 'close'}
                </button>
                {
                    this.state.open ?
                    <div>
                        test data
                        <ul>
                            <li>
                                authToken: {this.state.sessiontest.authToken}
                            </li>
                            <li>
                                refreshToken: {this.state.sessiontest.refreshToken}
                            </li>
                        </ul>
                    </div>
                    :
                    null
                }
            </div>
        )
    }
}