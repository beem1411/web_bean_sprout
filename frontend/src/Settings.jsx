import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Settings.css';

const Settings = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSubmit, setIsSubmit] = useState(false);
  const [day ,setDay] = useState("");
  const [soak ,setSoak] = useState("");
  const [minute ,setMinute] = useState("");
  const [endTime ,setEndTime] = useState("");
  const [startTime ,setStartTime] = useState("");
  const [temperature ,setTemperature] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('http://localhost:8000/getSettings');
        console.log("API Response:", response.data);
        
        setSettings({
          day:response.data.setting.day,
          soak:response.data.setting.soak,
          minute:response.data.setting.minute,
          endTime:response.data.setting.endTime,
          startTime:response.data.setting.startTime,
          temperature:response.data.setting.temperature,
        })
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  useEffect(() => {
    if (settings?.day &&settings?.soak &&settings?.minute &&settings?.endTime &&settings?.startTime &&settings?.temperature) {
      setDay(settings.day);
      setSoak(settings.soak);
      setMinute(settings.minute);
      setEndTime(settings.endTime);
      setStartTime(settings.startTime);
      setTemperature(settings.temperature);
    }
  }, [settings]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.patch('http://localhost:8000/updateSettings',{
        day:day,
        soak:soak,
        minute:minute,
        endTime:endTime,
        startTime:startTime,
        temperature:temperature,
      })
      setIsSubmit(true);
      setTimeout(() => setIsSubmit(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    }   
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let i = 0; i < 24; i++) {
      const time = i.toString().padStart(2, '0') + ':00';
      times.push(
        <option key={time} value={time}>
          {time}
        </option>
      );
    }
    return times;
  };

  return (
    <div className="container">
      <h2 className="title">ตั้งค่าเบื้องต้น</h2>
      {loading ? (
        <p className="loading">กำลังโหลดข้อมูล...</p>
      ) : (
        <form onSubmit={handleSubmit} className="settings-form">
          <div className="card">
            <div className="form-group">
              <label htmlFor="soak">เวลาแช่ถั่วงอก (ชั่วโมง) :</label>
              <input
                type="number"
                name="soak"
                defaultValue={settings.soak}
                onChange={(e) => setSoak(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="day">เวลาของกระบวนการปลูก (วัน) :</label>
              <input
                type="number"
                name="day"
                defaultValue={settings.day}
                onChange={(e) => setDay(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="startTime">เริ่มต้นการปลูก :</label>
              <select
                name="startTime"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              >
                {generateTimeOptions()}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="endTime">สิ้นสุดการปลูก :</label>
              <select
                type="time"
                step="1" 
                name="endTime"
                defaultValue={settings.endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              >
                {generateTimeOptions()}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="minute">ระยะเวลารดน้ำต่อรอบ (นาที) :</label>
              <div className="duration-inputs">
                <input
                  type="number"
                  name="minute"
                  defaultValue={settings.minute}
                  onChange={(e) => setMinute(e.target.value)}
                  placeholder="นาที"
                  min="0"
                  max="59"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="temperature">อุณหภูมิ (°C):</label>
              <input
                type="number"
                name="temperature"
                defaultValue={settings.temperature}
                onChange={(e) => setTemperature(e.target.value)}
                placeholder="องศาเซลเซียส"
                min="0"
                max="40"
              />
            </div>
          </div>

          {isSubmit && <p className="success-message">บันทึกสำเร็จ!</p>}
          <div className="button-group">
            <button type="submit" className="save-button">
              บันทึก
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Settings;
