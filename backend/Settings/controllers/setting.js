const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../../config/database');
const router = express.Router();
const mqtt = require('mqtt');

const MQTT_BROKER_IP = '210.246.215.73'; // Your broker IP
const MQTT_PORT = 1883;

const mqttClient = mqtt.connect(`mqtt://${MQTT_BROKER_IP}:${MQTT_PORT}`);

mqttClient.on('connect', () => {
    console.log(`✅ Connected to MQTT broker at ${MQTT_BROKER_IP}:${MQTT_PORT}`);
});

// 🔹 Get settings and publish to MQTT
router.get('/getSettings', async(req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM settings');

        if (rows.length === 0) {
            return res.status(404).json({ message: 'No settings found' });
        }

        const setting = rows[0]; // First row

        // Publish settings to MQTT
        const mqttPayload = JSON.stringify(setting);

        // Publish to MQTT
        const mqttTopic = 'newdata';
        mqttClient.publish(mqttTopic, mqttPayload, { qos: 1 }, (err) => {
            if (err) {
                console.error('❌ Error publishing settings:', err);
            } else {
                console.log('📡 Settings published to MQTT:', mqttPayload);
            }
        });


        res.json({ setting });

    } catch (error) {
        console.error('❌ Error fetching settings:', error);
        res.status(500).json({ message: 'Error fetching settings', error: error.message });
    }
});

// 🔹 Update settings
router.patch('/updateSettings', async(req, res) => {
    try {
        const { day, soak, minute, endTime, startTime, temperature } = req.body;

        if (!day || !soak || !minute || !endTime || !startTime || !temperature) {
            return res.status(400).json({ error: 'ข้อมูลไม่ครบ' });
        }

        await db.execute(
            'UPDATE settings SET day = ?, soak = ?, minute = ?, endTime = ?, startTime = ?, temperature = ?', [day, soak, minute, endTime, startTime, temperature]
        );

        res.status(200).json({ message: '✅ แก้ไขการตั้งค่าสำเร็จ' });

    } catch (error) {
        console.error('❌ Error updating settings:', error);
        res.status(500).json({ message: 'Error updating settings', error: error.message });
    }
});

module.exports = router;