import axios, { Method } from "axios"
import qs from "qs"
import KEYS from "../config/keys"

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
                method: method,
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

    async getUser(authToken: string): Promise<User> {
        let userResult = await this.callSpotify('me', 'get', authToken)
        const userProto = userResult
        const user: User = {
            id: userProto.id,
            displayName: userProto.display_name,
            username: userProto.id,
            profileUrl: userProto.uri,
            profilePic: userProto.images ? userProto.images[0].url : DEFAULT_PROFILE_PIC_URL,
            followers: userProto.followers.total,
        }
        return user
    }

    async getTopArtists(authToken: string): Promise<any[]> {
        const artists = await this.callSpotify('me/top/artists', 'get', authToken)
        return artists.items
    }

    async getTopTracks(authToken: string): Promise<any[]> {
        const artists = await this.callSpotify('me/top/tracks', 'get', authToken)
        return artists.items
    }

    async getArtistTopTracks(artistId: string, authToken: string): Promise<any[]> {
        const params = { country: 'from_token' }
        const data = await this.callSpotify(`artists/${artistId}/top-tracks`, 'get', authToken, params)
        return data.tracks
    }

    async getRelatedArtists(artistId: string, authToken: string): Promise<any[]> {
        const data = await this.callSpotify(`artists/${artistId}/related-artists`, 'get', authToken)
        return data.artists
    }

    async getArtistAlbums(artistId: string, authToken: string, limit?: number): Promise<any[]> {
        const data = await this.callSpotify(`artists/${artistId}/albums`, 'get', authToken)
        if (limit) return data.items.slice(limit)
        return data.items
    }

    async getAlbums(albumIds: string[], authToken: string): Promise<any[]> {
        const params = { 
            market: 'from_token',
            ids: albumIds.reduce((ids, nextId) => ids + ',' + nextId)
        }
        const data = await this.callSpotify(`albums`, 'get', authToken, params)
        return data.albums
    }
}

export interface Auth {
    authToken: string
    refreshToken: string
}

export interface User {
    id: string;
    username: string;
    displayName: string;
    profileUrl: string | null;
    profilePic: string;
    country?: string;
    followers: number | null;
    product?: string | null;
    emails?: [{ value: string; type: null }];
}

export const spotifyClient = new SpotifyClient()
