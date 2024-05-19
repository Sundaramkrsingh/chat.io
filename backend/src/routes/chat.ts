import express from 'express'

const chatRouter = express()

// authentication middleware 
chatRouter.use('/', (req, res, next) => {
    if (req.session && req.session.user) {
        next()
    } else {
        res.status(401).json({ message: 'Not authenticated' })
    }
})



export default chatRouter