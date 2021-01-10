import React, { FC, useState } from "react";
import { TrackList } from "../../components/TrackList";
import { TrackData } from '../../lib/types'
import { appClient } from "../../services/appClient";

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