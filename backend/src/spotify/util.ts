import _ from 'lodash'


// Select random N items from a list
export const selectRandom = (list: any[], N: number) => {
    const newList = []
    if (list.length < N) { N = list.length }
    for (let i = 0; i < N; i = i+1) {
        const index = Math.floor(Math.random() * list.length)
        newList.push(list[index])
    }
    return newList
}

// Remove duplicates from a list based on id param
export const dedupById = (list: any[]) => {
    return _.uniqBy(list, 'id')
}

// Removes tracks with the same artist
export const dedupByArtist = (list: any[]) => {
    return _.uniqBy(list, (item)=>item.artists[0])
}

// Convert tracks to log-friendly form
export const simplifyTracks = (tracks: any[]) => {
    return tracks.map(track => {
        return {
            name: track.name,
            artists: track.artists.map((artist: any) => artist.name),
            // album: track.album.name
            id: track.id
        }
    })
}