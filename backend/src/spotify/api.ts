import express from 'express'
import { spotifyController } from './controller'
import { simplifyTracks } from './util'

const app = express()

app.get('/user', async (req, res) => {
    console.log('hit /user')
    res.send(await spotifyController.getUser(req.session.authToken))
})

app.get('/topArtists', async (req, res) => {
    console.log('hit /topArtists')
    res.send(await spotifyController.getTopArtists(req.session.authToken))
})

app.get('/someTopTracks', async (req, res) => {
    console.log('hit /someTopTracks')
    const result = await spotifyController.getSomeTopTracks(req.session.authToken)
    res.send(result)
})

app.get('/test', async (req, res) => {
    console.log('hit /test')
    const playlistTest = await spotifyController.generatePlaylist3(req.session.authToken)
    console.log(simplifyTracks(playlistTest))

    res.send({ message: simplifyTracks(playlistTest) })
})


export { app as spotifyApp }