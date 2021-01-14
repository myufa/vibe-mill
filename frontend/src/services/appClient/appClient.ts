import axios, { AxiosResponse, CancelTokenStatic, Method } from "axios";
import { Type } from "typescript";
import { UserData, TrackData, PlaylistData, AnalyzedTrackData } from "../../lib/types";

export class AppClient {
    baseUrl: string
    CancelToken: CancelTokenStatic
    isCancel: (value: any) => boolean

    constructor() {
        this.baseUrl = 'http://localhost:8080/'
        this.CancelToken = axios.CancelToken
        this.isCancel = axios.isCancel
    }

    async callApp(path: string, method: Method , headers?: any, options?: any) {
        console.log('calling: ', this.baseUrl + path)
        let result: AxiosResponse
        try {
            result = await axios({
                withCredentials: true,
                url: this.baseUrl + path,
                method,
                headers: { ...headers },
                ...options
            })
            console.log(result.status)
        } catch (err) {
            console.log(err)
            throw err
        }

        return result.data
    }

    login() {
        window.open(this.baseUrl + "auth/spotify", "_self");
    }

    logout() {
        window.open(this.baseUrl + "auth/logout", "_self");
    }

    async loginSuccess(options?: any): Promise<UserData> {
        const headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
        }
        const result =  await this.callApp('auth/login/success', 'get', headers, options)
        return result.user
    }

    async getTest() {
        const result = await this.callApp('/spotify/test', 'get')
        return result
    }

    async getUserData(): Promise<UserData> {
        const result = await this.callApp('spotify/user', 'get')
        return result.user
    }

    async getPlaylist(playlistId: string): Promise<TrackData[]> {
        const options = { data: { playlistId } }
        const result = await this.callApp('spotify/playlist', 'post', {}, options)
        console.log('playlist result', result)
        return result.tracks
    }

    async getPlaylists(): Promise<PlaylistData[]> {
        const result = await this.callApp('spotify/user-playlists', 'get')
        console.log('playlists result', result)
        return result.playlists
    }

    async getTopArtists() {
        const result = await this.callApp('spotify/top-artists', 'get')
        return result
    }

    async getSomeTopTracks() {
        const result = await this.callApp('spotify/some-top-tracks', 'get')
        return result
    }

    async generatePlaylist(): Promise<TrackData[]> {
        const result: { tracks: TrackData[] } = await this.callApp('spotify/generate-playlist', 'get')
        return result.tracks
    }

    async savePlaylist(trackIds: string[], playlistName: string): Promise<PlaylistData> {
        const options = { data: { trackIds, playlistName } }
        const result: { playlist: PlaylistData } = await this.callApp('spotify/save-playlist', 'post', {}, options)
        return result.playlist
    }

    async reorganizePlaylist(playlistId: string): Promise<AnalyzedTrackData[]> {
        const options = { data: { playlistId } }
        const result = await this.callApp('spotify/reorganize-playlist', 'post', {}, options)
        console.log('reorganize result', result)
        return result.tracks
    }


}

export const appClient = new AppClient()
