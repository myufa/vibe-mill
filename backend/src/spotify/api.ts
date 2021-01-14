import express from 'express'
import { spotifyController } from './controller'

const app = express()

app.get('/user', async (req, res) => {
    console.log('hit /user')
    res.send(await spotifyController.getUser(req.session.authToken))
})

app.get('/top-artists', async (req, res) => {
    console.log('hit /topArtists')
    res.send(await spotifyController.getTopArtists(req.session.authToken))
})

app.get('/some-top-tracks', async (req, res) => {
    console.log('hit /someTopTracks')
    const result = await spotifyController.getSomeTopTracks(req.session.authToken)
    res.send(result)
})

app.get('/user-playlists', async (req, res) => {
    console.log('hit /user-playlists')
    const playlists = await spotifyController.getPlaylists(req.session.authToken)
    res.send(playlists)
})

app.post('/playlist', async (req, res) => {
    console.log('hit /playlist')
    const { playlistId } = req.body
    console.log('playlistId: ', playlistId)
    const playlist = await spotifyController.getPlaylist(playlistId, req.session.authToken)
    res.send(playlist)
})

app.get('/generate-playlist', async (req, res) => {
    console.log('hit /generate-playlist')
    const playlists = await spotifyController.generatePlaylist2(req.session.authToken)
    console.log(playlists)
    res.send(playlists)
})

app.post('/save-playlist', async (req, res) => {
    console.log('hit /save-playlist')
    const { trackIds, playlistName } = req.body
    const playlist = await spotifyController.savePlaylist(trackIds, playlistName, req.session.user.id, req.session.authToken)
    console.log(playlist)
    res.send(playlist)
})

app.post('/reorganize-playlist', async (req, res) => {
    console.log('hit /reorganize-playlist')
    const { playlistId } = req.body
    console.log('playlistId: ', playlistId)
    const playlist = await spotifyController.reorganizePlaylist(playlistId, req.session.authToken)
    res.send(playlist)
})

app.get('/test', async (req, res) => {
    console.log('hit /test')
    const playlistTest = await spotifyController.generatePlaylist1(req.session.authToken)
    console.log('final tracks', playlistTest)

    res.send({ message: playlistTest })
})


export { app as spotifyApp }