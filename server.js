import { } from 'dotenv/config'
import express, { json } from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'

import sendMessageRouter from './routes/sendMessageRouter.js'

const app = express()

app.use(cors())
app.use(json())

// Authenticate and Generate token 
app.post('/v1/login', (req, res) => {

    const userId = req.body.userId
    const user = { ID: userId }

    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)

    res.status(200).json({
        accessToken: token
    })
})

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.status(401).json({
        status: 'Forbidden',
    })

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403).json({
            status: 'Unauthorized'
        })
        req.user = user
        next()
    })
}

app.use('/v1/send-message', authenticateToken, sendMessageRouter)

app.listen(process.env.SERVER_PORT || 4000, () => {
    let port = process.env.SERVER_PORT || 4000
    console.log("Server is Running on : " + port)
})