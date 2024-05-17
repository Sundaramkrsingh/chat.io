import express from 'express'
import userRouter from './routes/user'
import chatRouter from './routes/chat'

const app = express()
const port = 3000
app.use(express.json())

app.use('/user', userRouter)
app.use('/user', chatRouter)

app.listen(port)