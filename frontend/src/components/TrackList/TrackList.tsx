import React, { FC, useEffect, useRef } from "react";
import { TrackData } from '../../lib/types'
import './TrackList.scss'

export const TrackList: FC<{tracks: TrackData[]}> = (props) => {
    const tracks = props.tracks
    const renderTracks = (track: TrackData, i: number) => {
        const artistString = track.artists.reduce((a,b)=> `${a}, ${b}`)
        return (
            <div className='track' key={track.id}>
                <div className='cover'>
                    <img src={track.imageUrl}/>
                </div>
                <div className='name'
                     title={`${track.name} by: ${artistString}`}
                >{track.name.slice(0,20)}</div>
                <div className='artists'>{artistString.slice(0,20)}</div>
                <div className='album'>{track.album}</div>
                <div className='duration'>-{track.duration}</div>
            </div>
        )
    }
    return (
        <ul className='TrackList'>
            {tracks.map(renderTracks)}
        </ul>
    )
}

