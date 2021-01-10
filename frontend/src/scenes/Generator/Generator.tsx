import React, { FC, useEffect, useRef, useState } from "react";
import { Redirect } from "react-router-dom";
import { TrackList } from "../../components/TrackList";
import { TrackData } from '../../lib/types'
import { appClient } from "../../services/appClient";
import './Generator.scss'

export const Generator: FC = () => {
    const [ tracks, setTracks ] = useState<TrackData[]>([])

    const generatePlaylist = () => {
        appClient.generatePlaylist()
        .then(generatedTracks => {
            setTracks(generatedTracks)
        })
    }

    return (
        <div className='Generator'>
            <button className='GenerateButton' onClick={generatePlaylist}>
                Generate Playlist
            </button>
            {tracks ? 
                <TrackList tracks={tracks} />
            :
                null
            }
        </div>
    )
}