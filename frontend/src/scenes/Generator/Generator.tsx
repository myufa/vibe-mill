import React, { FC, useEffect, useRef, useState } from "react";
import { TrackList } from "../../components/TrackList";
import { PlaylistData, TrackData } from '../../lib/types'
import { appClient } from "../../services/appClient";
import './Generator.scss'

export const Generator: FC = () => {
    const [ tracks, setTracks ] = useState<TrackData[]>([])
    const [ savedPlaylist, setSavedPlaylist ] = useState<PlaylistData | null>(null)
    const [ playlistName, setPlaylistName ] = useState('~vibes~')
    const [ err, setErr ] = useState('')

    const generatePlaylist = () => {
        appClient.generatePlaylist()
        .then(generatedTracks => {
            setTracks(generatedTracks)
        })
    }

    const savePlaylist = () => {
        appClient.savePlaylist(tracks.map(track=>track.id), playlistName)
        .then(playlist => {
            setSavedPlaylist(playlist)
        })
        .catch(err => {
            setErr(err.message)
        })
    }
    console.log('TRACKS', tracks)

    return (
        <div className='Generator'>
            <div className='controls'>
                <button className='GenerateButton' onClick={generatePlaylist}>
                    Generate Playlist
                </button>
                {tracks.length ? 
                    <button className='SaveButton' onClick={savePlaylist}>
                        Save Playlist
                    </button>
                : null
                }
            </div>
            {tracks.length ? 
                <TrackList tracks={tracks} />
            :
                null
            }
        </div>
    )
}