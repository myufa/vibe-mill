import express from 'express'
import { spotifyController } from './controller'

const app = express()

app.get('/user', async (req, res, next) => {
    console.log('hit /user')
    let result
    try {
        result = await spotifyController.getUser(req.session.authToken)
    } catch(err) {
        return next(err)
    }
    res.send(result)
})

app.get('/top-artists', async (req, res, next) => {
    console.log('hit /topArtists')
    let result
    try {
        result = await spotifyController.getTopArtists(req.session.authToken)
    } catch(err) {
        return next(err)
    }
    res.send(result)
})

app.get('/some-top-tracks', async (req, res, next) => {
    console.log('hit /someTopTracks')
    let result 
    try {
        result = await spotifyController.getSomeTopTracks(req.session.authToken)
    } catch(err) {
        return next(err)
    }
    res.send(result)
})

app.get('/user-playlists', async (req, res, next) => {
    console.log('hit /user-playlists')
    let playlists 
    try {
        playlists = await spotifyController.getPlaylists(req.session.authToken)
    } catch(err) {
        return next(err)
    }
    res.send(playlists)
})

app.post('/get-playlist', async (req, res, next) => {
    console.log('hit /get-playlist')
    const { playlistId } = req.body
    console.log('playlistId: ', playlistId)
    let playlist 
    try {
        playlist = await spotifyController.getPlaylist(playlistId, req.session.authToken)
    } catch(err) {
        return next(err)
    }
    res.send(playlist)
})

app.post('/get-playlist-with-features', async (req, res, next) => {
    console.log('hit /get-playlist-with-featues')
    const { playlistId } = req.body
    console.log('playlistId: ', playlistId)
    let playlist 
    try {
        playlist = await spotifyController.getPlaylistWithFeatures(playlistId, req.session.authToken)
    } catch(err) {
        return next(err)
    }
    res.send(playlist)
})

app.get('/generate-playlist', async (req, res, next) => {
    console.log('hit /generate-playlist')
    let playlists 
    try{
        playlists = await spotifyController.generatePlaylist2(req.session.authToken)
    } catch(err) {
        return next(err)
    }
    console.log(playlists)
    res.send(playlists)
})

app.post('/save-playlist', async (req, res, next) => {
    console.log('hit /save-playlist')
    const { trackIds, playlistName } = req.body
    let playlist 
    try {
        playlist = await spotifyController.savePlaylist(
            trackIds, playlistName,
            req.session.user.id,
            req.session.authToken
        )
    } catch(err) {
        return next(err)
    }
    console.log(playlist)    
    res.send(playlist)
})

app.post('/reorganize-and-save-playlist', async (req, res, next) => {
    console.log('hit /reorganize-playlist')
    const { feature, playlistId } = req.body
    console.log('playlistId: ', playlistId)
    let playlist 
    try {
        playlist = await spotifyController.reorganizeAndSavePlaylist(
            feature,
            playlistId,
            req.session.user.id,
            req.session.authToken
        )
    } catch(err) {
        return next(err)
    }
    res.send(playlist)
})

app.get('/test', async (req, res, next) => {
    console.log('hit /test')
    console.log('session check', req.session.refreshToken, req.session.authToken)
    // let data 
    // try {
    //     data = await spotifyController.test(req.session.refreshToken, req.session.authToken)
    // } catch (err) {
    //     return next(err)
    // }
    // console.log('TEST', data)

    // res.send({ data })
    req.session = null
    res.status(402).send({cookies: req.cookies})
})


export { app as spotifyApp }