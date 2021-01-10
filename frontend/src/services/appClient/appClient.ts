import axios, { AxiosResponse, CancelTokenStatic } from "axios";
import { Type } from "typescript";
import { UserData, TrackData } from "../../lib/types";

export class AppClient {
    baseUrl: string
    CancelToken: CancelTokenStatic
    isCancel: (value: any) => boolean

    constructor() {
        this.baseUrl = 'http://localhost:8080/'
        this.CancelToken = axios.CancelToken
        this.isCancel = axios.isCancel
    }

    async callApp(path: string, headers?: any, options?: any) {
        console.log('calling: ', this.baseUrl + path)
        let result: AxiosResponse
        try {
            result = await axios.get(this.baseUrl + path, {
                withCredentials: true,
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
        const result =  await this.callApp('auth/login/success', headers, options)
        return result.user
    }

    async getTest() {
        const result = await this.callApp('/spotify/test')
        return result
    }

    async getUserData(): Promise<UserData> {
        const result = await this.callApp('spotify/user')
        return result.user
    }

    async getPlaylists() {
        const result = await this.callApp('spotify/user-playlists')
        return result
    }

    async getTopArtists() {
        const result = await this.callApp('spotify/top-artists')
        return result
    }

    async getSomeTopTracks() {
        const result = await this.callApp('spotify/some-top-tracks')
        return result
    }

    async generatePlaylist(): Promise<TrackData[]> {
        const result: {tracks: TrackData[]} = await this.callApp('spotify/generate-playlist')
        return result.tracks
    }


}

export const appClient = new AppClient()
