import { PrismaClient } from '@prisma/client'
import { Request } from 'express'
import express from "express"
import { WebSocketServer, WebSocket } from 'ws'

const prisma = new PrismaClient()
const wss = new WebSocketServer({ noServer: true })
const chatRouter = express()

// session check middleware
chatRouter.use('/', (req, res, next) => {
    if (req.session && req.session.user) {
        next()
    } else {
        res.status(401).json({ message: 'Not authenticated' })
    }
})

// route to fetch all messages 
chatRouter.get("/messages", async (req, res) => {
    try {
        const messages = await prisma.message.findMany({
            select: { 
                username: true, 
                text: true,
                timeStamp: true
            }
        })

        res.json({
            messages
        })
    } catch(err) {
        console.log("Error while fetching messages", err)
        res.status(411).json({
            msg: "Error while fetching messages"
        })
    }
})


// websokcet logic
wss.on("connection", (ws: WebSocket, request: Request) => {
    const user = request.session?.user
    console.log(`New WebSocket connection from user: ${user?.username}`)

    ws.on("message", async (message: string) => {
        let receivedMessage: {
            username: string,
            text: string,
            timeStamp: string
        } = { username: "", text: "", timeStamp: "" }

        try {
            receivedMessage = JSON.parse(message)
        } catch(err) {
            console.log("Failed to parse the received message", err)
        }
        
        console.log(`Received message: ${receivedMessage.text}`)

        // storing in db
        try {
            await prisma.message.create({
                data: {
                    username: receivedMessage.username,
                    text: receivedMessage.text,
                    timeStamp: receivedMessage.timeStamp
                }
            })
        } catch(err) {
            console.log("user not found", err)
        }
        
        // Broadcast the message to all clients
        const broadcastMessage = JSON.stringify(receivedMessage)
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(broadcastMessage)
            }
        })
    })

    ws.on("close", () => {
        console.log(`WebSocket connection closed for user: ${user?.username}`)
    })
})

export { chatRouter, wss }