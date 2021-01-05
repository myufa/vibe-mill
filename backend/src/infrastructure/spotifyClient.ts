import axios, { Method } from "axios"
import qs from "qs"
import KEYS from "../config/keys"
import { AlbumData, ArtistData, PlaylistData, Reference, TrackData, UserData } from '../lib/types'

const DEFAULT_PROFILE_PIC_URL = ''

export class SpotifyClient {
    scopes: string[]
    baseUrl: string

    constructor() {
        // This is where you get all the spotify data ;)
        this.baseUrl = 'https://api.spotify.com/v1/'
    }

    // wrapper function to simplify axios call for all spotify-api interactions
    async callSpotify(path: string, method: Method, authToken: string, params?: any) {
        let result: any
        if (!path || !method || !authToken) {
            throw new Error("Missing Request vars")
        }
        try {
            result = await axios({
                url: this.baseUrl + path,
                params,
                method,
                headers: {
                        'Authorization': 'Bearer ' + authToken
                }
            })
        } catch(err) {
            console.log(err)
            throw err
        }
        return result.data
    }

    // Used in auth to convert sign-in code to auth token
    // All third-party api requests an auth token
    async getAuth(code: string | qs.ParsedQs | string[] | qs.ParsedQs[]): Promise<Auth> {
        let authResult: any
        try {
            authResult = await axios({
                url: "https://accounts.spotify.com/api/token",
                method: "post",
                params: {
                    client_id: KEYS.SPOTIFY_CLIENT_ID,
                    client_secret: KEYS.SPOTIFY_SECRET,
                    code,
                    redirect_uri: 'http://localhost:8080/auth/spotify/redirect',
                    grant_type: 'authorization_code'
                },
                headers: {
                    // 'Authorization': 'Basic ' + (Buffer.from(KEYS.SPOTIFY_CLIENT_ID + ':' + KEYS.SPOTIFY_SECRET).toString('base64')),
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Accept: 'application/json',
                }
            })
        } catch(err) {
            console.log(err)
            throw err
        }
        const authToken = authResult.data.access_token
        const refreshToken = authResult.data.refresh_token
        return {
            authToken,
            refreshToken
        }
    }

    async getUser(authToken: string): Promise<UserData> {
        const userResult = await this.callSpotify('me', 'get', authToken)
        const userProto = userResult
        return {
            id: userProto.id,
            displayName: userProto.display_name,
            username: userProto.id,
            profilePic: userProto.images ? userProto.images[0].url : DEFAULT_PROFILE_PIC_URL,
            followers: userProto.followers.total,
            product: userProto.product
        }
    }

    async getPlaylistTracks(playlistId: string, authToken: string): Promise<TrackData[]> {
        const params = {
            limit: 10
        }
        const data: any = await this.callSpotify(
            `me/playlists/${playlistId}/tracks`,
            'get',
            authToken,
            params
        )
        const trackProtos: any[] = data.items.map((item: any) => item.track)
        const result = trackProtos.map(convertTrack)
        return result
    }

    async getPlaylists(authToken: string): Promise<Reference[]> {
        const data = await this.callSpotify('me/playlists', 'get', authToken)
        const playlistProtos: any[] = data.items
        const result: Reference[] = playlistProtos.map(convertReference)
        return result
    }

    async getTopArtists(authToken: string): Promise<ArtistData[]> {
        const data = await this.callSpotify('me/top/artists', 'get', authToken)
        const artistProtos: any[] = data.items
        const result: ArtistData[] = artistProtos.map(convertArtist)
        return data.items
    }

    async getTopTracks(authToken: string): Promise<TrackData[]> {
        const data = await this.callSpotify('me/top/tracks', 'get', authToken)
        const trackProtos = data.tracks
        const result: TrackData[] = trackProtos.map(convertTrack)
        return result
    }

    async getArtistTopTracks(artistId: string, authToken: string): Promise<TrackData[]> {
        const params = { country: 'from_token' }
        const data = await this.callSpotify(`artists/${artistId}/top-tracks`, 'get', authToken, params)
        const trackProtos = data.tracks
        const result: TrackData[] = trackProtos.map(convertTrack)
        return result
    }

    async getRelatedArtists(artistId: string, authToken: string): Promise<ArtistData[]> {
        const data = await this.callSpotify(`artists/${artistId}/related-artists`, 'get', authToken)
        const artistProtos = data.artists
        const result: ArtistData[] = artistProtos.map(convertArtist)
        return result
    }

    async getArtistAlbums(artistId: string, authToken: string, limit?: number): Promise<Reference[]> {
        const params: any = {}
        if (limit) {
            params.limit = limit
        }
        const data = await this.callSpotify(`artists/${artistId}/albums`, 'get', authToken, params)
        const albumProtos = data.items
        const result: Reference[] = albumProtos.map(convertReference)
        return result
    }

    async getAlbums(albumIds: string[], authToken: string): Promise<AlbumData[]> {
        const params = {
            market: 'from_token',
            ids: albumIds.reduce((ids, nextId) => ids + ',' + nextId)
        }
        const data = await this.callSpotify(`albums`, 'get', authToken, params)
        const albumProtos = data.albums
        const result: AlbumData[] = albumProtos.map(convertAlbum)
        return result
    }

    async getTracks(trackIds: string[], authToken: string): Promise<TrackData[]> {
        const params = {
            market: 'from_token',
            ids: trackIds.slice(0,50).reduce((ids, nextId) => ids + ',' + nextId)
        }
        const data = await this.callSpotify(`tracks`, 'get', authToken, params)
        const trackProtos = data.tracks
        const result: TrackData[] = trackProtos.map(convertTrack)
        return result
    }
}

export interface Auth {
    authToken: string
    refreshToken: string
}

export const msToDuration = (ms: number) => {
    const min = Math.floor(ms / 60000)
    const sec = Math.floor((ms % 60000) / 1000)
    const secString = sec.toString().padStart(2, '0')
    return `${min}:${secString}`
}

const convertTrack = (trackProto: any): TrackData => {
    return {
        id: trackProto.id,
        name: trackProto.name,
        artists: trackProto.artists.map((artist: any) => artist.name),
        album: trackProto.album.name,
        imageUrl: trackProto.album.images[0].url,
        duration: msToDuration(trackProto.duration_ms)
    }
}

const convertArtist = (artistProto: any): ArtistData => {
    return {
        id: artistProto.id,
        name: artistProto.name
    }
}

const convertReference = (dataProto: any): Reference => {
    return {
        id: dataProto.id,
        name: dataProto.name
    }
}

const convertAlbum = (albumProto: any): AlbumData => {
    return {
        id: albumProto.id,
        name: albumProto.name,
        tracks: albumProto.tracks.items.map((trackProto: any) => {
            return {
                id: trackProto.id,
                name: trackProto.name
            }
        })
    }
}

export const spotifyClient = new SpotifyClient()
