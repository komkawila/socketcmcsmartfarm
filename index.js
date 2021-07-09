var mqtt = require('mqtt');

const MQTT_SERVER = "mqtt.devcm.info";
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
    console.log("MQTT Connect");
    clientMQTT.subscribe('MQTT1', function (err) {
        if (err) {
            console.log(err);
        }
    });
});

// Receive Message and print on terminal
clientMQTT.on('message', function (topic, message) {
    // message is Buffer
    console.log(message.toString());
});

setInterval(() => {
    clientMQTT.publish("MQTT1", "hello from NodeJS");
}, 5000);