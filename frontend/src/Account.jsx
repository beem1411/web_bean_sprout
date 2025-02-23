import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Account.css';

const Connection = () => {
    const [data, setData] = useState([]); // เก็บข้อมูลจาก API
    const [loading, setLoading] = useState(true); // ใช้แสดงสถานะการโหลด
    const [searchTerm, setSearchTerm] = useState(''); // ใช้เก็บค่าการค้นหา

    // ดึงข้อมูลจาก API
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

    console.log(data);

    return (
        <div>
            <h2 className="title">บัญชีผู้ใช้ทั้งหมด</h2>


            <table className="connection-table">
                <thead>
                    <tr>
                        <th>รายการ</th>
                        <th>จำนวน</th>
                    </tr>
                </thead>
                <tbody>
                {loading ? (
                    <tr>
                        <td>กำลังโหลด...</td>
                    </tr>
                ):( data.length > 0 ? (
                        data.map((item, index) => (
                            <tr key={index}>
                                <td>{item.name}</td>
                                <td>{item.count}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="2">ไม่มีข้อมูล</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Connection;
