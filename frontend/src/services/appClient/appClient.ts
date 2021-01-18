import axios, { AxiosResponse, CancelTokenStatic, Method } from "axios";
import { Type } from "typescript";
import { UserData, TrackData, PlaylistData, AnalyzedTrackData, Feature } from "../../lib/types";

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
        return await axios({
            withCredentials: true,
            url: this.baseUrl + path,
            method,
            headers: { ...headers },
            ...options
        })
    }

    async refreshSpotifyToken() {
        return await axios({
            withCredentials: true,
            url: this.baseUrl + 'auth/refresh-token',
            method: 'get',
            headers: { "Access-Control-Allow-Credentials": true }
        })
    }

    async getData(path: string, method: Method , headers?: any, options?: any) {
        console.log('calling: ', this.baseUrl + path)
        let result: AxiosResponse
        try {
            result = await this.callApp(path, method, headers, options)
            console.log(result.status)
        } catch (err) {
            // Attempt to refresh token and call again
            console.log('refreshing token', err)
            let refreshResult
            try {
                refreshResult = await this.refreshSpotifyToken()
                console.log('refreshResult', refreshResult)
                result = await this.callApp(path, method, headers, options)
            } catch(refreshErr) {
                console.log('Failed to refresh login token', refreshErr.response.data.errors)
                console.log(refreshErr.response.data)
                if (refreshErr.response.data.wasAuthed) window.location.reload()
                throw refreshErr
            }
            if (!refreshResult.data.success) throw new Error('Could not refresh')
            console.log('post refresh error', err)
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
        const result = await this.getData('auth/login/success', 'get', headers, options)
        return result.user
    }

    async getTest() {
        const result = await this.getData('spotify/test', 'get')
        return result
    }

    async getUserData(): Promise<UserData> {
        const result = await this.getData('spotify/user', 'get')
        return result.user
    }

    async getPlaylist(playlistId: string): Promise<TrackData[]> {
        const options = { data: { playlistId } }
        const result = await this.getData('spotify/get-playlist', 'post', {}, options)
        console.log('playlist result', result)
        return result.tracks
    }

    async getPlaylists(): Promise<PlaylistData[]> {
        const result = await this.getData('spotify/user-playlists', 'get')
        console.log('playlists result', result)
        return result.playlists
    }

    async getTopArtists() {
        const result = await this.getData('spotify/top-artists', 'get')
        return result
    }

    async getSomeTopTracks() {
        const result = await this.getData('spotify/some-top-tracks', 'get')
        return result
    }

    async generatePlaylist(): Promise<TrackData[]> {
        const result: { tracks: TrackData[] } = await this.getData('spotify/generate-playlist', 'get')
        return result.tracks
    }

    async savePlaylist(trackIds: string[], playlistName: string): Promise<PlaylistData> {
        const options = { data: { trackIds, playlistName } }
        const result: { playlist: PlaylistData } = await this.getData('spotify/save-playlist', 'post', {}, options)
        return result.playlist
    }

    async getPlaylistWithFeatures(playlistId: string): Promise<AnalyzedTrackData[]> {
        const options = { data: { playlistId } }
        const result: { tracks: AnalyzedTrackData[] } = await this.getData('spotify/get-playlist-with-features', 'post', {}, options)
        console.log('tracks with features result', result)
        return result.tracks
    }

    async saveReorganizedPlaylist(feature: Feature, playlistId: string): Promise<AnalyzedTrackData[]> {
        const options = { data: { feature, playlistId } }
        const result: { tracks: AnalyzedTrackData[] } = await this.getData('spotify/reorganize-and-save-playlist', 'post', {}, options)
        console.log('reorganize result', result)
        return result.tracks
    }


}

export const appClient = new AppClient()
