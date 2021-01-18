import express, { Request, Response, NextFunction} from "express"
import bodyParser from 'body-parser'
import cookieSession from "cookie-session"
import cors from "cors";
import cookieParser from "cookie-parser" // parse cookie header
import keys from './config/keys'
import { authApp } from './auth/api'
import { spotifyApp } from './spotify/api'
import { ApiError } from "./lib/types"

export const startServer = () => {
    // Initialized main app
    const app = express();
    const port = process.env.PORT || 8080; // default port to listen

    // cookies
    const cookieOptions: CookieSessionInterfaces.CookieSessionOptions = {
        name: "session",
        keys: [keys.COOKIE_KEY],
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 100
    }
    if (process.env.stage === 'prod') cookieOptions.secure = true
    app.use(cookieSession(cookieOptions))

    app.use(cookieParser());

    // Allow cors with client
    // Will need to change for deployment
    app.use(cors({
        origin: "http://localhost:3000", // allow to server to accept request from different origin
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
        credentials: true // allow session cookie from browser to pass through
    }));
    app.options('*', cors());

    app.use(bodyParser.json())

    const authCheck = (req: Request, res: Response, next: NextFunction) => {
        console.log('my middleware')
        if (!req.session.user) {
            res.status(401).json({
                status: 401,
                authenticated: false,
                message: "user has not been authenticated"
            });
        } 
        else {
            next()
        }
    };

    app.use('/auth', authApp)
    app.use(authCheck)
    
    // basic activity ping check
    app.get('/ping', ( req, res ) => {
        res.send({ message: 'pong' })
    })

    // Add routes
    app.use('/spotify', spotifyApp)
    app.use('/static', express.static(__dirname + '/static'))

    // Display JSON errors
    app.use((err: ApiError | any, req: Request, res: Response, next: NextFunction) => {
        // format errors
        console.error('Error handling', JSON.stringify({ ...err, stack: err.stack }, null, 2))
        if (!err.isApiError) {
        // @ts-ignore
            res.status(err.status || 500).send({
                message: err.message,
                stack: err.stack,
                errors: [err.errors],
            })
        } else {
        res.status(err.errorCode).send({
            message: err.message,
            stack: err.stack,
            name: err.name
            })
        }
        next()
    })

    // start the Express server
    app.listen( port, () => {
        console.log( `server started at http://localhost:${ port }` );
    } );

    return app
}
