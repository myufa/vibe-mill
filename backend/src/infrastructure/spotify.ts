import axios from "axios"
import KEYS from "../config/keys"

const DEFAULT_PROFILE_PIC_URL = ''

export class SpotifyClient {
    scopes: string[] = []

    async getAuth(code: string | qs.ParsedQs | string[] | qs.ParsedQs[]): Promise<Auth> {
        let authResult: any
        try {
            authResult = await axios({
                url: "https://accounts.spotify.com/api/token",
                method: "post",
                params: {
                    client_id: KEYS.SPOTIFY_CLIENT_ID,
                    client_secret: KEYS.SPOTIFY_SECRET,
                    code: code,
                    redirect_uri: 'http://localhost:8080/auth/spotify/redirect',
                    grant_type: 'authorization_code'
                },
                headers: {
                    //'Authorization': 'Basic ' + (Buffer.from(KEYS.SPOTIFY_CLIENT_ID + ':' + KEYS.SPOTIFY_SECRET).toString('base64')),
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
        let userResult: any
        try {
            userResult = await axios({
            url: 'https://api.spotify.com/v1/me',
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + authToken
            }
            })
        } catch(err) {
            console.log(err)
            throw err
        }
        const userProto = userResult.data
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
