export interface UserData {
    id: string
    username: string
    displayName: string
    profilePic: string
    followers: number
    product: "premium" | "free"
}

export interface TrackData {
    id: string
    name: string
    artists: string[]
    album: string
    imageUrl: string
    duration: string
}

export interface ArtistData extends Reference {
    images?: string[]
}

export interface AlbumData {
    id: string
    name: string
    tracks: TrackData[] | Reference[]
    duration?: number
}

export interface PlaylistData extends Reference {
    duration?: number
}

export interface Reference {
    id: string
    name: string
}
