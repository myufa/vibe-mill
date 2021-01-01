import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';
import { CLIENT_ID, CLIENT_SECRET } from './../config/spotify_creds'

class SpotifyService {
    id: string
    secret: string
    baseUrl = 'https://api.spotify.com/v1/'

    constructor(id: string, secret: string) {
        this.id = id
        this.secret = secret
    }
}

export const spotifyService = new SpotifyService(CLIENT_ID, CLIENT_SECRET)