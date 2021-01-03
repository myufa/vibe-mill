import React, { Component } from "react";
import axios from 'axios';
//import { User } from './../types'

const baseUrl = 'http://localhost:8080'
  
interface state {
    open: boolean
    test: any
}

export class Tester extends Component<{}, state> {
    state: state

    constructor() {
        super({})
        this.state = {
            open: false,
            test: {}
        }

        this.handleOpen = this.handleOpen.bind(this)
        this.getArtistTest = this.getArtistTest.bind(this)
        this.getSomeTopTracksTest = this.getSomeTopTracksTest.bind(this)
        this.getTest = this.getTest.bind(this)
    }

    handleOpen() {
        this.setState({open: !this.state.open})

        if (this.state.open) {
            this.getArtistTest()
            this.getSomeTopTracksTest()
            this.getTest()
        }        
    }

    // componentDidMount(){
    //     this.getArtistTest()
    // }

    async getArtistTest() {
        const path = '/spotify/topArtists'
        await axios.get(baseUrl + path, {
            withCredentials: true
        })
        .then(res=>{
            const artists = res.data
            console.log('artists', artists)
        })
        .catch((err)=> console.log(err))
    }

    async getSomeTopTracksTest() {
        const path = '/spotify/someTopTracks'
        await axios.get(baseUrl + path, {
            withCredentials: true
        })
        .then(res=>{
            console.log('tracks', res.data)
        })
        .catch((err)=> console.log(err))
    }

    async getTest() {
        const path = '/spotify/test'
        await axios.get(baseUrl + path, {
            withCredentials: true
        })
        .then(res=>{
            console.log('test', res.data)
            this.setState({test: res.data})
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
                                test: { JSON.stringify(this.state.test)}
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