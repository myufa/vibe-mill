import _ from 'lodash'
import { TrackData } from '../lib/types'

// Select random N items from a list
export const selectRandom = <T>(list: T[], N: number) => {
    const newList = []
    const indeces = new Set()
    if (list.length < N) { N = list.length }
    while (newList.length < N) {
        const index = Math.floor(Math.random() * list.length)
        if (!indeces.has(index)) {
            indeces.add(index)
            newList.push(list[index])
        }
    }
    return newList
}

// Remove duplicates from a list based on id param
export const dedupById = <T>(list: T[]) => {
    return _.uniqBy(list, 'id')
}

// Removes tracks with the same artist
export const dedupByArtist = (list: TrackData[]) => {
    return _.uniqBy(list, (item)=>item.artists[0])
}

export const objectArrayToNames = (list: any[]) => {
    return list.map(item => item.name)
}

export const tracksByArtist = (tracks: any[]) => {
    return tracks.map(track => track.artists.map((artist: any) => artist.name))
}
