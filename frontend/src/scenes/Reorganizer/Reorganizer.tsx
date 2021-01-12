import React, { FC, useEffect, useRef, useState } from "react";
import { PlaylistData } from "../../lib/types";
import { appClient } from "../../services/appClient";
import './Reorganizer.scss'

export const Reorganizer: FC = () => {
    const [ playlists, setPlaylists ] = useState<PlaylistData[]>([])
    const [ loading, setLoading ] = useState(true)

    const getPlaylists = () => {
        appClient.getPlaylists()
        .then(data => {
            setPlaylists(data)
            setLoading(false)
        })
        .catch(err => {
            setLoading(false)
            throw err
        })
    }

    useEffect(getPlaylists, [])

    const renderPlaylist = (playlist: PlaylistData, i: number) => {
        return (
            <div className='playlist' key={i}>
                <div className='cover'>
                    <img src={playlist.coverUrl} alt={playlist.name}/>
                </div>
                <div className='name'>
                    {playlist.name}
                </div>
            </div>
        )
    }

    return (
        <>
        {!loading ? 
            <div className='Reorganizer'>
                <div className='playlistContainer'>
                    {playlists.map(renderPlaylist)}
                </div>
            </div>
        :
            null
        }  
        </>      
    )
}