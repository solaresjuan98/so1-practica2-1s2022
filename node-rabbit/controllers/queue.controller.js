const { request, json, response } = require('express');
const amqp = require('amqplib');
const { rabbitSettings } = require('../helpers/rabbitSettings')

// Get messages (consumer)
const getQueueMessages = async (req, res = response) => {

    // Cambiar el request.body para adaptarlo
    const queue = "user_create";
    //const queue = "user_create";
    const enterprise = "usac"


    try {

        const conn = await amqp.connect(rabbitSettings);
        //console.log(conn);
        console.log('Connection created')

        const channel = await conn.createChannel();
        console.log('Channel create');

        const result = await channel.assertQueue(queue);
        console.log('Queue created :D')

        console.log(`Waiting for changes from ${enterprise}`)

        channel.consume(queue, message => {

            let user = JSON.parse(message.content.toString())
            console.log(`Received user ${user.name}`)

            if (user.enterprise === enterprise) {
                channel.ack(message)
                console.log('Delete message from queue...')
            } else {
                console.log("That message is not for me I'll not delete it")
            }

        })


    } catch (err) {
        console.error(`Error -> ${err}`)
    }

    return res.json({
        "mensaje": true
    })
}

// Enqueue
const enqueueMessage = async (req, result = response) => {

    //const queue = "user_messages";
    const queue = "cola_ganadores";
    //const newQueue = "students";
    /**
     * 
     *  game_id: 1, players: jugadores, game_name: "Random1", winner: juego1(jugadores).nombre, queue: "RabbitMQ"
     * 
     */
    const { game_id, players, game_name, winner, queuename } = req.body;

    const user = {
        game_id,
        players, game_name, winner, queuename
    };

    try {

        const conn = await amqp.connect(rabbitSettings);

        console.log('Connection created');

        const channel = await conn.createChannel();
        console.log('Channel create');

        let res = await channel.assertQueue(queue);
        console.log('Queue created');

        await channel.sendToQueue(queue, Buffer.from(JSON.stringify(user)))
        console.log(`Message sent to queue ${queue}`)

    } catch (error) {

        console.log(`Error -> ${err}`);
        return result.status(500).json({
            message: "An error has occured",
            ok: true
        })
    }

    return result.json({
        message: "The messages has been sent to queue"
    })
}

module.exports = {
    getQueueMessages,
    enqueueMessage

}