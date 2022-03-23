import { Router } from 'express'
import fcmService from '../service/FcmService.js'
const sendMessageRouter = Router()

sendMessageRouter.post('/', (req, res) => {

    const userId = req.body.userId
    const message = JSON.parse(req.body.message)
    const senderId = req.body.senderId

    if (req.user.ID === senderId) {
        fcmService(userId, message).then(() => {
            res.json({
                status: 'OK'
            })
        }).catch((e) => {
            res.json({
                status: "FAIL",
                Error: e,
            })
        })
    } else {
        res.sendStatus(403).json({
            status: 'Unauthorized'
        })
    }

})

export default sendMessageRouter