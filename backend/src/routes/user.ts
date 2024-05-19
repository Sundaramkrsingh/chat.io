import express from 'express'
import { signinInput, signupInput } from '../zod'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const userRouter = express()
const prisma = new PrismaClient()

// signup route
userRouter.post('/signup', async (req, res) => {
    try {
        // validating inputs
        const body = req.body
        const validate = signupInput.safeParse(body)
        if (!validate.success) {
            res.status(411)
            return res.json({
                msg: "Invalid inputs"
            })
        }

        // checking for similar email in db
        const existing = await prisma.user.findFirst({
            where: { email: body.email }
        })
    
        if (existing) {
            return res.status(411).json({
                msg: "User with this email already exists"
            })
        }

        // hashing password and making entry of user in db
        const hashedPassword = await bcrypt.hash(body.password, 10)
        const user = await prisma.user.create({
            data: {
                username: body.username,
                email: body.email,
                password: hashedPassword
            }
        })

        // inserting user details in session
        req.session.user = {
            username: user.username,
            email: user.email,
        }

        res.status(200)
        return res.json({
            signup: true,
            user: {
                email: user.email,
                username: user.username
            }
        })
    } catch(e) {
        console.log(e)
        return res.status(400).json({
            msg: "Error while Signing up"
        })
    }
})


// signin route 
userRouter.post('/signin', async (req, res) => {
    try {
        // validating inputs
        const body = req.body
        const validate = signinInput.safeParse(body)
        if (!validate.success) {
            res.status(411) 
            return res.json({
                msg: "Invalid Inputs"
            })
        }

        // fetching user details from db
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: body.email },
                    { username: body.email }
                ]
            }
        }) 

        if (!user) {
            res.status(403)
            return res.json({
                msg: "User with this email does not exist"
            })
        }

        // verifying password
        const passwordValidation = await bcrypt.compare(body.password, user.password)
        if (!passwordValidation) {
            return res.status(403).json({
                msg: "Incorrect password"
            })
        }

        // inserting user details in session
        req.session.user = {
            username: user.username,
            email: user.email
        }

        return res.status(200).json({
            signin: true,
            user: {
                email: user.email,
                username: user.username
            }
        })
    } catch(e) {
        console.log(e) 
        res.status(400).json({
            msg: "Error while Singning in"
        })
    }
})


// signout route
userRouter.get('/signout', (req, res) => {
    res.clearCookie('connect.sid', { path: '/' })
    return res.json({
        signout: true
    })
})

export default userRouter