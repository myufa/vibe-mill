import { ApiError } from './types'
export class SpotifyClientError extends Error implements ApiError {
    errorCode: number = 500
    isApiError: true = true

    constructor(message: string, errorCode: number = 500) {
        super(message)
        this.errorCode = errorCode
    }
}