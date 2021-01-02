import express, { Request, Response, NextFunction} from "express";
import { authApp } from './auth'
import { spotifyService } from './spotify'
import cookieSession from "cookie-session";
import passport from "passport";
import cors from "cors";
import cookieParser from "cookie-parser"; // parse cookie header
import keys from './config/keys'
import { passportSetup } from './config/passport-setup'

export const startServer = () => {
    const app = express();
    const port = process.env.PORT || 8080; // default port to listen

    // cookies
    app.use(cookieSession({
        name: "session",
        keys: [keys.COOKIE_KEY],
        maxAge: 24 * 60 * 60 * 100
    }))

    app.use(cookieParser());

    passportSetup()

    // initalize passport
    app.use(passport.initialize());
    // deserialize cookie from the browser
    app.use(passport.session());

    app.use(cors({
        origin: "http://localhost:3000", // allow to server to accept request from different origin
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true // allow session cookie from browser to pass through
    }));

    // Add auth routes
    app.use('/auth', authApp)

    const authCheck = (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
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
        user: req.user,
        cookies: req.cookies
        });
    });

    app.get('/ping', ( req, res ) => {
        res.send({ message: 'pong' })
    })

    // start the Express server
    app.listen( port, () => {
        console.log( `server started at http://localhost:${ port }` );
    } );

    return app
}
