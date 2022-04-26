
// const amqp = require('amqplib')
const amqp = require('amqplib/callback_api')
const CONN_URL = 'amqps://dilppmyy:FQ2Q4EGE7wCr5i4WiJ8Ll5EX9Hlm4prX@jaguar.rmq.cloudamqp.com/dilppmyy';
let ch = null;


amqp.connect(CONN_URL, function name(err, conn) {
    conn.createChannel(function (err, channel) {
        ch = channel;
    });
})

const publishToQueue = async (queueName, data) => {
    ch.sendToQueue(queueName, new Buffer.from(data));
}

process.on('exit', (code) => {
    ch.close();
    console.log(`Closing rabbitmq channel`);
});

module.exports = {
    publishToQueue
}

