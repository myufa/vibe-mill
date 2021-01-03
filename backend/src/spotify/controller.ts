import { SpotifyClient, spotifyClient, User } from './../infrastructure/spotify'
import { selectRandom, dedupById, dedupByArtist } from './util'


export class SpotifyController {
    client: SpotifyClient

    constructor() {
        // Initialize our spotify-api client
        this.client = spotifyClient
    }

    async getUser(authToken: string) {
        return { user: await this.client.getUser(authToken) }
    }

    async getTopArtists(authToken: string) {
        return { artists: (await this.client.getTopArtists(authToken)).slice(0,3) }
    }

    async getArtistTopTracks(artist: string, authToken: string) {
        return {
            artist,
            tracks: (await this.client.getArtistTopTracks(artist, authToken))
        }
    }

    // Gets a few top tracks of users top artists
    async getSomeTopTracks(authToken: string) {
        const artists = await this.client.getTopArtists(authToken)
        const artistIds: string[] = artists.map((artist: any) => artist.id)
        // console.log('artistIds: ', artistIds)

        const tracks: any[] = (
            await Promise.all(
                artistIds.map(artistId => {
                    return this.client.getArtistTopTracks(artistId, authToken)
                })
            )
        )
        .flat(1)
        // ^flat is made possible by adding "lib": ["es2019"] to tsconfig compilerOptions
        // takes array of arrays and flattens to one cohesive array

        return {
            tracks
        }

    }

    async generatePlaylist1(authToken: string) {
        // Selection amounts for each step
        const N = 10
        const M = 10
        const p = 5

        // Get a random cohort of user's top artists
        const artists = await this.client.getTopArtists(authToken)
        let artistIds: string[] = artists.map((artist) => artist.id)
        artistIds = selectRandom(artistIds, N)

        // Get artists related to the user's top artists
        const relatedArtists = (
            await Promise.all(
                artistIds.map(artistId => {
                    return this.client.getRelatedArtists(artistId, authToken)
                })
            )
        )
        .flat(1)

        let relatedArtistIds = relatedArtists.map((artist) => artist.id)

        // Select random cohort
        relatedArtistIds = selectRandom(relatedArtistIds, M)

        // Get top tracks of artists related to user's top artists
        let tracks: any[] = (
            await Promise.all(
                relatedArtistIds.map(artistId => {
                    return this.client.getArtistTopTracks(artistId, authToken)
                })
            )
        )
        .flat(1)

        // select unique random cohort of tracks
        tracks = selectRandom(dedupById(tracks), p)

        return tracks
    }

    async generatePlaylist3(authToken: string) {
        // Selection amounts for each step
        const N = 10
        const M = 10
        const p = 5

        // Get a random cohort of user's top artists
        const artists = await this.client.getTopArtists(authToken)
        let artistIds: string[] = artists.map((artist) => artist.id)
        artistIds = selectRandom(artistIds, N)

        // Get artists related to the user's top artists
        const relatedArtists = (
            await Promise.all(
                artistIds.map(artistId => {
                    return this.client.getRelatedArtists(artistId, authToken)
                })
            )
        ).flat(1)

        let relatedArtistIds = relatedArtists.map((artist) => artist.id)

        // Select random cohort
        relatedArtistIds = selectRandom(relatedArtistIds, M)

        // Get a couple randomly selected albums from each artist related the user's top artists
        const albums: any[] = (
            await Promise.all(
                relatedArtistIds.map(artistId => {
                    return this.client.getArtistAlbums(artistId, authToken)
                })
            )
        )
        .map(collection => {
            return dedupById(selectRandom(collection, 2))
        })
        .flat(1)

        let albumIds: string[] = albums.map(album => album.id)

        // Select random cohort
        albumIds = selectRandom(albumIds, p)

        // Get track objects for each album selected
        const albumsWithTracks: any[] = await this.client.getAlbums(albumIds, authToken)

        // Get randomly selected tracks from albums of artists related user's top artists
        let tracks = albumsWithTracks.map(album => {
            return album.tracks.items
        })
        .map(album => {
            return dedupById(selectRandom(album, 15))
        })
        .flat(1)

        // Ensure no track is by the same artist
        tracks = dedupByArtist(tracks)

        // select unique random cohort of tracks
        tracks = selectRandom(dedupById(tracks), p)
        
        return tracks
    }


}

export const spotifyController = new SpotifyController()