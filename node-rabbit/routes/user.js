//import { publishToQueue } from '../services/MQService';
const { Router } = require('express');
const { getQueueMessages, enqueueMessage } = require('../controllers/queue.controller');
//let { publishToQueue } = require('../services/MQService')

const userRouter = Router();


userRouter.get('/test', (req, res) => {

    return res.json({
        msg: "hola"
    })
})

userRouter.get('/queue', getQueueMessages)
userRouter.post('/addMessage', enqueueMessage);

module.exports = { userRouter };