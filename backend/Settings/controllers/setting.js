const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../../config/database');
const router = express.Router();
const mqtt = require('mqtt');

// กำหนดค่าการเชื่อมต่อ MQTT Broker
const MQTT_BROKER_IP = '210.246.215.73'; // ที่อยู่ IP ของ MQTT Broker
const MQTT_PORT = 1883; // พอร์ต MQTT

// เชื่อมต่อกับ MQTT Broker
const mqttClient = mqtt.connect(`mqtt://${MQTT_BROKER_IP}:${MQTT_PORT}`);

mqttClient.on('connect', () => {
    console.log(`✅ Connected to MQTT broker at ${MQTT_BROKER_IP}:${MQTT_PORT}`);
});

// 🔹 API สำหรับดึงค่าการตั้งค่าจากฐานข้อมูล และส่งค่าผ่าน MQTT
router.get('/getSettings', async(req, res) => {
    try {
        // ดึงข้อมูลการตั้งค่าจากฐานข้อมูล
        const [rows] = await db.execute('SELECT * FROM settings');

        if (rows.length === 0) {
            return res.status(404).json({ message: 'No settings found' }); // ถ้าไม่มีข้อมูล
        }

        const setting = rows[0]; // เลือกแถวแรกจากฐานข้อมูล

        // แปลงข้อมูลเป็น JSON เพื่อนำไปส่งผ่าน MQTT
        const mqttPayload = JSON.stringify(setting);

        // กำหนดหัวข้อ MQTT ที่จะส่งข้อมูล
        const mqttTopic = 'newdata';

        // ส่งข้อมูลไปยัง MQTT Broker
        mqttClient.publish(mqttTopic, mqttPayload, { qos: 1 }, (err) => {
            if (err) {
                console.error('❌ Error publishing settings:', err);
            } else {
                console.log('📡 Settings published to MQTT:', mqttPayload);
            }
        });

        res.json({ setting }); // ส่งข้อมูลการตั้งค่ากลับไปให้ client

    } catch (error) {
        console.error('❌ Error fetching settings:', error);
        res.status(500).json({ message: 'Error fetching settings', error: error.message });
    }
});

// 🔹 API สำหรับอัปเดตค่าการตั้งค่า
router.patch('/updateSettings', async(req, res) => {
    try {
        // รับค่าที่ส่งมาจาก client
        const { day, soak, minute, endTime, startTime, temperature } = req.body;

        // ตรวจสอบว่าข้อมูลครบถ้วนหรือไม่
        if (!day || !soak || !minute || !endTime || !startTime || !temperature) {
            return res.status(400).json({ error: 'ข้อมูลไม่ครบ' });
        }

        // อัปเดตค่าการตั้งค่าในฐานข้อมูล
        await db.execute(
            'UPDATE settings SET day = ?, soak = ?, minute = ?, endTime = ?, startTime = ?, temperature = ?', [day, soak, minute, endTime, startTime, temperature]
        );

        res.status(200).json({ message: '✅ แก้ไขการตั้งค่าสำเร็จ' });

    } catch (error) {
        console.error('❌ Error updating settings:', error);
        res.status(500).json({ message: 'Error updating settings', error: error.message });
    }
});

// ส่ง router ออกไปเพื่อใช้ในส่วนอื่น
module.exports = router;