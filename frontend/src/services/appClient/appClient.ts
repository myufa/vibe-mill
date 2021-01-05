import axios from "axios";
import { UserData, TrackData } from "../../lib/types";

export class AppClient {
    baseUrl = 'http://localhost:8080/'

    async callApp(path: string, headers?: any) {
        console.log('calling: ', this.baseUrl + path)
        let result: any
        try {
            result = await axios.get(this.baseUrl + path, {
                withCredentials: true,
                headers: { ...headers }
            })
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

    async loginSuccess(): Promise<UserData> {
        const headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
        }
        const result =  await this.callApp('auth/login/success', headers)
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
