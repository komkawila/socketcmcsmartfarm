import express from 'express'
import bodyParser from 'body-parser'
import http from 'http'
import socketIO from 'socket.io'

// +++++++++
import mqtt from 'mqtt';

const MQTT_SERVER = "203.159.93.171";
const MQTT_PORT = "1883";
const MQTT_USER = "mqtt_smartfarm"; 
const MQTT_PASSWORD = "mqtt0910690204";

var clientMQTT = mqtt.connect({
    host: MQTT_SERVER,
    port: MQTT_PORT,
    username: MQTT_USER,
    password: MQTT_PASSWORD
});

clientMQTT.on('connect', function () {
    // Subscribe any topic
    // console.log("MQTT Connect");
    clientMQTT.subscribe('MQTT2', function (err) {
        if (err) {
            console.log(err);
        }
    });
});

// +++++++++

const server = express()
const port = 9000;

server.use(bodyParser.json())
server.use(bodyParser.urlencoded({
    extended: true
}))


const app = server.listen(port, function (err, result) {
    console.log('running in port http://localhost:' + port)
})

const io = socketIO.listen(app);
// รอการ connect จาก client
io.on('connection', client => {
    console.log('user connected')
  
    // เมื่อ Client ตัดการเชื่อมต่อ
    client.on('disconnect', () => {
        console.log('user disconnected')
    })

    // ส่งข้อมูลไปยัง Client ทุกตัวที่เขื่อมต่อแบบ Realtime
    client.on('sent-message', function (message) {
        io.sockets.emit('new-message', message)
        clientMQTT.publish("MQTT2", message);
    })
})


// Receive Message and print on terminal
clientMQTT.on('message', function (topic, message) {
    // message is Buffer
    console.log(message.toString());
    io.sockets.emit('new-message', message.toString())
});
// setInterval(() => {
//     // clientMQTT.publish("MQTT2", "hello from NodeJS");
//     io.sockets.emit('new-message', "message")
// }, 1000);
export default server