import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Account.css';

const Connection = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/usersdetail');
                setData(response.data.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="account-page">
            <div className="account-container">
                <h1>บัญชีผู้ใช้ทั้งหมด</h1>
                {loading ? (
                    <p className="loading">กำลังโหลด...</p>
                ) : data.length > 0 ? (
                    <div className="card-container">
                        {data.map((item, index) => (
                            <div
                                className={`card ${item.name === "จำนวนบัญชีผู้ใช้งาน" ? "highlight-card" : ""}`}
                                key={index}
                            >
                                <h3 className="card-title">{item.name}</h3>
                                <p className="card-count">จำนวน: {item.count}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-data">ไม่มีข้อมูล</p>
                )}
            </div>
        </div>
    );
};

export default Connection;
