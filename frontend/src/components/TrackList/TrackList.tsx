import React, { FC, useEffect, useRef } from "react";
import { TrackData } from '../../lib/types'
import './TrackList.scss'

export const TrackList: FC<{tracks: TrackData[]}> = (props) => {
    const tracks = props.tracks
    console.log('tracklisttest', tracks)
    const renderTracks = (track: TrackData, i: number) => {
        return (
            <li key={track.id}>
                <img src={track.imageUrl}/>
                <div className='name'>{track.name.slice(0,20)}</div>
                <div className='artists'>{track.artists.reduce((a,b)=> `${a}, ${b}`).slice(0,20)}</div>
                <div className='duration'>{track.duration}</div>
            </li>
        )
    }
    return (
        <ul className='TrackList'>
            {tracks.map(renderTracks)}
        </ul>
    )
}

