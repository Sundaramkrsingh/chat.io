import express, { Request, Response } from 'express'
import userRouter from './routes/user'
import { chatRouter, wss } from './routes/chat'
import http from 'http'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import cors from 'cors'

const app = express()
const port = 3000
const SESSION_SECRET = process.env.SESSION_SECRET || ''

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.json())
app.use(cors({
    origin: ['http://localhost:5173'],
    methods: ['POST', 'GET', 'PUT', 'DELETE'],
    credentials: true
}))

// Session middleware
const sessionMiddleware = session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: 'lax'
    }
})


app.use(sessionMiddleware)
app.use("/api/v1/user", userRouter)
app.use("/api/v1/chat", chatRouter)

// Session verify route
app.get('/api/v1/session', (req: Request, res: Response) => {
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


const server = http.createServer(app)

// WebSocket upgrade handling with session middleware
server.on("upgrade", (request: Request, socket, head) => {
    sessionMiddleware(request, {} as Response, () => {
        if (!request.session.user) {
            socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
            socket.destroy()
            return
        }

        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request)
        })
    })
})

server.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})