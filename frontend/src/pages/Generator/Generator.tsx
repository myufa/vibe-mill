import React, { FC, useEffect, useRef, useState } from "react";
import { TextForm } from "../../components/TextForm";
import { TrackList } from "../../components/TrackList";
import { PlaylistData, TrackData } from '../../lib/types'
import { appClient } from "../../services/appClient";
import './Generator.scss'

export const Generator: FC = () => {
    const [ tracks, setTracks ] = useState<TrackData[]>([])
    const [ savedPlaylist, setSavedPlaylist ] = useState<PlaylistData | null>(null)
    const [ err, setErr ] = useState('')

    const generatePlaylist = () => {
        appClient.generatePlaylist()
        .then(generatedTracks => {
            setTracks(generatedTracks)
        })
    }

    const savePlaylist = (playlistName: string) => {
        console.log(playlistName)
        appClient.savePlaylist(tracks.map(track=>track.id), playlistName)
        .then(playlist => {
            setSavedPlaylist(playlist)
        })
        .catch(err => {
            setErr(err.message)
        })
    }

    const TEST = () => {
        appClient.getTest()
        .then(data => {
            console.log(data)
        })
        .catch(err => {
            console.log(err)
        })
    }

    console.log('TRACKS', tracks)

    return (
        <div className='Generator'>
            <div className='controls'>
                <div className='GenerateButton'>
                    <button  onClick={generatePlaylist}>
                        Generate Playlist
                    </button>
                </div>
                {tracks.length ?
                    <>
                        <div className='SaveButton'>
                            <button onClick={() => savePlaylist('~vibes~')}>
                                Save Playlist
                            </button>
                        </div> 
                        <div className='PlaylistNameForm'>
                            <TextForm submitText={savePlaylist} placeHoler='~vibes~'/>
                        </div>
                    </>
                    
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