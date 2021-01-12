export interface UserData {
    id: string
    username: string
    displayName: string
    profilePic: string
    followers: number
    product: "premium" | "free"
}

export interface TrackData extends Reference {
    artists: string[]
    album: string
    imageUrl: string
    duration: string
}

export interface ArtistData extends Reference {
    images?: string[]
}

export interface AlbumData extends Reference {
    tracks: TrackData[] | Reference[]
    duration?: number
}

export interface PlaylistData extends Reference {
    coverUrl: string
}

export interface Reference {
    id: string
    name: string
}
