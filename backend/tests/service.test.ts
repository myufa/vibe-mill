import request, { agent } from 'supertest'
import assert from 'assert'
import open from 'open'
import axios, { AxiosResponse } from 'axios'
import { app } from './server'
import { TEST_USER, TEST_PASSWORD } from '../config/spotify_creds'

const baseUrl = 'http://localhost:8080'
const server = agent('http://localhost:8080')

describe('ALL TESTS', () => {
    before(async (done) => {
        console.log('Pre Auth Step')
        let authenticated = false
        const wait = (ms=5000) => new Promise((r, j)=>setTimeout(r, ms))
        const redirectResponse = await axios.get(baseUrl + '/auth/spotify')
        const redirectUrl = redirectResponse.request.res.responseUrl
        console.log(redirectResponse.request.res.responseUrl)
        console.log('sign in at: ', redirectUrl)
        open(redirectUrl)
        let attempts = 1
        while (!authenticated) {
            console.log('...sign in pending')
            const homeResponse = await fetch(baseUrl + '/auth/login/test')
            console.log(attempts, homeResponse.status)
            attempts = attempts + 1
            authenticated = homeResponse.status === 200 ? true : false
            await wait()
        }
        console.log("AUTHED!")
        done()
    })

    describe('GET /ping', () => {
        it('responds with pong', (done) => {
            request(app)
            .get('/ping')
            .expect(200)
            .then((res) => {
                assert(res.body.message === 'pong')
                done()
            })
            .catch((err) => {
                done(new Error(err))
            })
        })
    })
})

