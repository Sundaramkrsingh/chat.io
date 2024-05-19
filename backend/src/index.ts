import express from 'express'
import userRouter from './routes/user'
import chatRouter from './routes/chat'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import cors from 'cors'

declare module 'express-session' {
    interface SessionData {
        user?: {
            username: string,
            email: string
        } 
    }
}


const app = express()
const port = 3000
const SESSION_SECRET = process.env.SESSION_SECRET || ""

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.json())
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true
}))

// session middleware
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: 'lax'
    }
}))

// main routes amazon.com/signin => amazon.xom/api/singin
app.use('/api/v1/user', userRouter)
app.use('/api/v1/chat', chatRouter)

// session verify route
app.get('/api/v1/session', (req, res) => {
    if (req.session.user) {
        res.json({ 
            isAuthenticated: true, 
            user: req.session.user 
        })
    } else {
        res.status(401).json({ 
            isAuthenticated: false
        })
    }
})

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})