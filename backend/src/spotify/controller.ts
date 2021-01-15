import { SpotifyClient, spotifyClient } from '../infrastructure/spotifyClient'
import {
    AnalyzedTrackData,
    ArtistData,
    Feature,
    PlaylistData,
    TrackData,
    UserData,
} from '../lib/types'
import {
    selectRandom,
    dedupById,
    dedupByArtist,
    objectArrayToNames,
    tracksByArtist,
    dedupByAlbum
} from './util'


export class SpotifyController {
    client: SpotifyClient

    constructor() {
        // Initialize our spotify-api client
        this.client = spotifyClient
    }

    async getUser(authToken: string): Promise<{ user: UserData }> {
        return { user: await this.client.getUser(authToken) }
    }

    async getPlaylists(authToken: string): Promise<{ playlists: PlaylistData[] }> {
        return { playlists: await this.client.getPlaylists(authToken) }
    }

    async getPlaylist(playlistId: string, authToken: string): Promise<{tracks: TrackData[]}> {
        return { tracks: await spotifyClient.getPlaylistTracks(playlistId, authToken) }
    }

    async getTopArtists(authToken: string): Promise<{ artists: ArtistData[] }> {
        return { artists: (await this.client.getTopArtists(authToken)).slice(0,3) }
    }

    async getArtistTopTracks(artist: ArtistData, authToken: string): Promise<{
        artist: ArtistData;
        tracks: TrackData[]
    }> {
        return {
            artist,
            tracks: await this.client.getArtistTopTracks(artist.id, authToken)
        }
    }

    // Gets a few top tracks of users top artists
    async getSomeTopTracks(authToken: string): Promise<{tracks: TrackData[]}> {
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

        return { tracks }

    }

    // Gets random top tracks of artists related to user's top artists
    async generatePlaylist1(authToken: string): Promise<{tracks: TrackData[]}> {
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
        let tracks= (
            await Promise.all(
                relatedArtistIds.map(artistId => {
                    return this.client.getArtistTopTracks(artistId, authToken)
                })
            )
        )
        .flat(1)

        // Ensure no track is by the same artist
        tracks = dedupByArtist(tracks)

        // select unique random cohort of tracks
        tracks = selectRandom(tracks, p)

        return { tracks }
    }

    // Gets random tracks from random albums of artists related to user's top artists
    async generatePlaylist2(authToken: string): Promise<{tracks: TrackData[]}> {
        // Selection amounts for each step
        const N = 20
        const M = 20
        const p = 10

        // Get a random cohort of user's top artists
        const artists = await this.client.getTopArtists(authToken)
        let artistIds: string[] = artists.map((artist) => artist.id)
        //artistIds = selectRandom(artistIds, N)

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
        const albums = (
            await Promise.all(
                relatedArtistIds.map(artistId => {
                    return this.client.getArtistAlbums(artistId, authToken)
                })
            )
        )
        .map(collection => {
            return selectRandom(collection, 2)
        })
        .flat(1)

        let albumIds: string[] = albums.map(album => album.id)

        // Select random cohort
        albumIds = selectRandom(albumIds, 20)

        // Get track objects for each album selected
        const albumsWithTracks = await this.client.getAlbums(albumIds, authToken)

        // Get randomly selected tracks from albums of artists related user's top artists
        const simpleTracks = albumsWithTracks.map(album => {
            return album.tracks
        })
        .map(album => {
            return selectRandom(album, 15)
        })
        .flat(1)

        // Get track ids of simple tracks to convert to full track objects
        const trackIds = simpleTracks.map(track => track.id)

        // Get track objects
        let tracks = await spotifyClient.getTracks(trackIds, authToken)

        // Ensure no track is by the same artist
        tracks = dedupByAlbum(tracks)

        // Ensure no track is by the same artist
        tracks = dedupByArtist(tracks)

        // select unique random cohort of tracks
        tracks = selectRandom(tracks, p)

        return { tracks }
    }

    async savePlaylist(
        trackIds: string[], 
        playlistName: string, 
        userId: string, 
        authToken: string
    ): Promise<{ playlist: PlaylistData }> {
        let playlist = await spotifyClient.createPlaylist(playlistName, userId, authToken)
        await spotifyClient.addTracksToPlaylist(playlist.id, trackIds, authToken)
        const tracks = await spotifyClient.getPlaylistTracks(playlist.id, authToken)
        playlist = await spotifyClient.getPlaylist(playlist.id, authToken)
        return { playlist }
    }

    async getPlaylistWithFeatures(playlistId: string, authToken: string): Promise<{tracks: AnalyzedTrackData[]}> {
        const simpleTracks = await spotifyClient.getPlaylistTracks(playlistId, authToken)
        const analyzedTracks = await spotifyClient.getTracksFeatures(simpleTracks, authToken)
        return { tracks: analyzedTracks }
    }

    async reorganizeAndSavePlaylist(
        feature: Feature, 
        playlistId: string, 
        userId: string,
        authToken: string
    ): Promise<{tracks: AnalyzedTrackData[]}> {
        // Get original playlist and tracks
        const originalPlaylist = await spotifyClient.getPlaylist(playlistId, authToken)
        const simpleTracks = await spotifyClient.getPlaylistTracks(playlistId, authToken)

        // Convert tracks to analyzed tracks
        const analyzedTracks = await spotifyClient.getTracksFeatures(simpleTracks, authToken)

        // Sort tracks
        const sortedTracks = [...analyzedTracks].sort((a, b) => (a[feature] - b[feature]))
        
        // Make new revibed playlist version
        const newPlaylistName = `${originalPlaylist.name} ~ ReVibed`
        let newPlaylist = await spotifyClient.createPlaylist(newPlaylistName, userId, authToken)
        
        // Add sorted tracks to new playlist
        const trackIds = sortedTracks.map(track => track.id)
        await spotifyClient.addTracksToPlaylist(newPlaylist.id, trackIds, authToken)

        // Return sorted tracks
        return { tracks: sortedTracks }
    }
}

export const spotifyController = new SpotifyController()
