import { SpotifyClient, spotifyClient, User } from './../infrastructure/spotify'
import { selectRandom, dedupById, dedupByArtist } from './util'

export class SpotifyController {
    client: SpotifyClient

    constructor() {
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
            artist: artist,
            tracks: (await this.client.getArtistTopTracks(artist, authToken))
        }
    }

    async getSomeTopTracks(authToken: string) {
        const artists = await this.client.getTopArtists(authToken)
        const artistIds: string[] = artists.map((artist: any) => artist.id)
        //console.log('artistIds: ', artistIds)

        const tracks: any[] = (
            await Promise.all(
                artistIds.map(artistId => {
                    return this.client.getArtistTopTracks(artistId, authToken)
                })
            )
        ).flat(1)

        return {  
            tracks: tracks
        }
        
    }

    async generatePlaylist1(authToken: string) {
        const N = 10
        const M = 10
        const p = 5
        const artists = await this.client.getTopArtists(authToken)
        let artistIds: string[] = artists.map((artist) => artist.id)
        artistIds = selectRandom(artistIds, N)
        const relatedArtists = (
            await Promise.all(
                artistIds.map(artistId => {
                    return this.client.getRelatedArtists(artistId, authToken)
                })
            )
        ).flat(1)

        let relatedArtistIds = relatedArtists.map((artist) => artist.id)

        relatedArtistIds = selectRandom(relatedArtistIds, M)

        let tracks: any[] = (
            await Promise.all(
                relatedArtistIds.map(artistId => {
                    return this.client.getArtistTopTracks(artistId, authToken)
                })
            )
        ).flat(1)
        
        tracks = selectRandom(dedupById(tracks), p)

        return tracks
    }

    async generatePlaylist3(authToken: string) {
        const N = 10
        const M = 10
        const p = 5

        const artists = await this.client.getTopArtists(authToken)
        let artistIds: string[] = artists.map((artist) => artist.id)
        artistIds = selectRandom(artistIds, N)

        const relatedArtists = (
            await Promise.all(
                artistIds.map(artistId => {
                    return this.client.getRelatedArtists(artistId, authToken)
                })
            )
        ).flat(1)

        let relatedArtistIds = relatedArtists.map((artist) => artist.id)

        relatedArtistIds = selectRandom(relatedArtistIds, M)

        let albums: any[] = (
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

        albumIds = selectRandom(albumIds, p)

        const albumsWithTracks: any[] = await this.client.getAlbums(albumIds, authToken)
        let tracks = albumsWithTracks.map(album => {
            return album.tracks.items
        })
        .map(album => {
            return dedupById(selectRandom(album, 15))
        })
        .flat(1)
        tracks = dedupByArtist(tracks)
        tracks = selectRandom(dedupById(tracks), p)
        return tracks
    }


}

export const spotifyController = new SpotifyController()