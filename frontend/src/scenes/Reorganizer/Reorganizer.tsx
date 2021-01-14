import React, { FC, useEffect, useRef, useState } from "react";
import { TrackList } from "../../components/TrackList";
import { AnalyzedTrackData, PlaylistData, TrackData } from "../../lib/types";
import { appClient } from "../../services/appClient";
import './Reorganizer.scss'

export const Reorganizer: FC = () => {
    const [ playlists, setPlaylists ] = useState<PlaylistData[]>([])
    const [ selectedPlaylistIndex, setSelectedPlaylistIndex ] = useState(-1)
    const [ tracks, setTracks ] = useState<TrackData[] | AnalyzedTrackData[]>([])
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

    const selectPlaylist = (playlistIndex: number) => {
        console.log('playlistid and index:', playlists[playlistIndex].id, playlistIndex)
        appClient.getPlaylist(playlists[playlistIndex].id)
        .then(data => {
            console.log('data to be set: ', data)
            setTracks(data)
            setSelectedPlaylistIndex(playlistIndex)
            console.log('tracks set: ', tracks)
        })
        .catch(err => {
            console.log(err)
            setTracks([])
        })
    }

    const renderPlaylist = (playlist: PlaylistData, i: number) => {
        return (
            <div className='playlist' key={i} 
                onClick={playlist.totalTracks < 400 ? 
                    () => selectPlaylist(i) 
                : () => null }
            >
                <div className='cover'>
                    <img src={playlist.coverUrl} alt={playlist.name}/>
                </div>
                <div className='name'>
                    {playlist.name}
                </div>
            </div>
        )
    }

    const reorganizePlaylist = () => {
        appClient.reorganizePlaylist(playlists[selectedPlaylistIndex].id)
        .then(data => {
            console.log('data to be set: ', data)
            setTracks(data)
            console.log('tracks set: ', tracks)
        })
        .catch(err => {
            console.log(err)
            setTracks([])
        })
    }

    useEffect(getPlaylists, [])

    return (
        <>
        {!loading ? 
            <div className='Reorganizer'>                
                <ul className='playlistContainer'>
                    {playlists.map(renderPlaylist)}
                </ul>
                {tracks.length ?
                    <button className='ReorganizeButton' onClick={reorganizePlaylist}>
                        Reorganize Playlist
                    </button>
                : null
                }
                {tracks.length ?
                    <div className='tracksContainer'>
                        <TrackList tracks={tracks}/>
                    </div>
                : null
                }
            </div>
        : null
        }
        </>      
    )
}