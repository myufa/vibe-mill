import React, { FC, useEffect, useRef, useState } from "react";
import { TrackList } from "../../components/TrackList";
import { AnalyzedTrackData, PlaylistData, Feature } from "../../lib/types";
import { appClient } from "../../services/appClient";
import './Reorganizer.scss'

export const Reorganizer: FC = () => {
    const [ playlists, setPlaylists ] = useState<PlaylistData[]>([])
    const [ selectedPlaylistIndex, setSelectedPlaylistIndex ] = useState(-1)
    const [ tracks, setTracks ] = useState<AnalyzedTrackData[]>([])
    const [ sortFeature, setSortFeature ] = useState<Feature | null>(null)
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
        appClient.getPlaylistWithFeatures(playlists[playlistIndex].id)
        .then(data => {
            console.log('data to be set: ', data)
            setTracks(data)
            setSelectedPlaylistIndex(playlistIndex)
            setSortFeature(null)
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
                id={i===selectedPlaylistIndex ? 'selected' : undefined}
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

    const reorganizePlaylist = (feature: Feature) => {
        console.log('reorganizePlaylist')
        if (feature) setTracks([...tracks].sort((a, b) => (a[feature] - b[feature])))
        setSortFeature(feature)
    }

    const saveReorganizedPlaylist = () => {
        if (!sortFeature) return
        appClient.saveReorganizedPlaylist(sortFeature, playlists[selectedPlaylistIndex].id)
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
                    <div className='controls'>
                        <span className='title'>Sort By</span>
                        <button className='ReorganizeButton' onClick={()=>reorganizePlaylist('danceability')}>
                            Danceability
                        </button>
                        <button className='ReorganizeButton' onClick={()=>reorganizePlaylist('energy')}>
                            Energy
                        </button>
                        <button className='ReorganizeButton' onClick={()=>reorganizePlaylist('valence')}>
                            Valence
                        </button>
                        {sortFeature ?
                            <button className='SaveButton' onClick={saveReorganizedPlaylist}>
                                Save
                            </button>
                        : null
                        }
                    </div>                    
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