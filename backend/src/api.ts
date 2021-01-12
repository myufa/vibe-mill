import express, { Request, Response, NextFunction} from "express";
import bodyParser from 'body-parser'
import cookieSession from "cookie-session";
import cors from "cors";
import cookieParser from "cookie-parser"; // parse cookie header
import keys from './config/keys'
import { authApp } from './auth/api'
import { spotifyApp } from './spotify/api'

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
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true // allow session cookie from browser to pass through
    }));

    app.use(bodyParser.json())

    // Add routes
    app.use('/auth', authApp)
    app.use('/spotify', spotifyApp)
    app.use('/static', express.static(__dirname + '/static'))

    const authCheck = (req: Request, res: Response, next: NextFunction) => {
        if (!req.session.user) {
            res.status(401).json({
                authenticated: false,
                message: "user has not been authenticated"
            });
        } else {
            next();
        }
    };

    // if it's already login, send the profile response,
    // otherwise, send a 401 response that the user is not authenticated
    // authCheck before navigating to home page
    app.get("/", authCheck, (req, res) => {
        res.status(200).json({
        authenticated: true,
        message: "user successfully authenticated",
        user: req.session.user,
        cookies: req.cookies
        });
    });

    // basic activity ping check
    app.get('/ping', ( req, res ) => {
        res.send({ message: 'pong' })
    })

    // start the Express server
    app.listen( port, () => {
        console.log( `server started at http://localhost:${ port }` );
    } );

    return app
}
