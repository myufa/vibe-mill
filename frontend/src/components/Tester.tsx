import React, { Component } from "react";
import axios from 'axios';
import { appClient } from '../services/appClient'
import { TrackList } from './TrackList'
import { TrackData } from "../lib/types";

const baseUrl = 'http://localhost:8080'

interface State {
    open: boolean
    test: TrackData[]
}

export class Tester extends Component<{}, State> {
    state: State

    constructor(props: {}) {
        super(props)
        this.state = {
            open: false,
            test: []
        }

        this.handleOpen = this.handleOpen.bind(this)
        this.getArtistTest = this.getArtistTest.bind(this)
        this.getSomeTopTracksTest = this.getSomeTopTracksTest.bind(this)
        this.generatePlaylist = this.generatePlaylist.bind(this)
        this.getTest = this.getTest.bind(this)
    }

    handleOpen() {
        this.setState({open: !this.state.open})

        if (!this.state.open) {
            this.getArtistTest()
            this.getSomeTopTracksTest()
            this.generatePlaylist()
            this.getTest()
        }
    }

    componentDidMount(){
        
    }

    async getArtistTest() {
        const artists = await appClient.getTopArtists()
        console.log('artists', artists)
    }

    async getSomeTopTracksTest() {
        const tracks = await appClient.getSomeTopTracks()
        console.log('tracks', tracks)
    }

    async generatePlaylist() {
        const tracks = await appClient.generatePlaylist()
        console.log('generated tracks', tracks)
        this.setState({test: tracks})
    }

    async getTest() {
        const path = '/spotify/test'
        await axios.get(baseUrl + path, {
            withCredentials: true
        })
        .then(res => {
            console.log('test', res.data)
            // this.setState({test: res.data})
        })
        .catch((err) => console.log(err))
    }

    render() {
        return (
            <div>
                <button onClick={this.handleOpen}>
                    {this.state.open ? 'close' : 'open'}
                </button>
                {
                    this.state.test ? 
                    <div>
                        <TrackList tracks={this.state.test} />
                    </div>
                    : null
                }
            </div>
        )
    }
}