import request from 'supertest'
import { app } from './server'
import assert from 'assert'

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
