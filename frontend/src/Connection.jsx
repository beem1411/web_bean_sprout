import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Connection.css"; 

const Connection = () => {
    const [data, setData] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [searchTerm, setSearchTerm] = useState(""); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:8000/userscon");
                console.log("Fetched Data:", response.data);
                setData(response.data || []); 
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // ฟิลเตอร์ข้อมูลตามค่าที่ค้นหา (เฉพาะ รหัสถังปลูก)
    const filteredData = data.flatMap((item) =>
        item.connections
            .filter((conn) => conn.tankId.toString().includes(searchTerm))
            .map((conn) => ({
                tankId: conn.tankId,
                firstname: item.firstname,
                lastname: item.lastname,
                status: conn.status,
            }))
    );

    return (
        <div>
            <h2 className="title">สถานะผู้ใช้แอพพลิเคชัน</h2>
            
            <div className="search-container">
                <input
                    type="text"
                    className="search-input"
                    placeholder="🔍 ค้นหา รหัสถังปลูก"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <table className="connection-table">
                <thead>
                    <tr>
                        <th>รหัสถังปลูก</th>
                        <th>ชื่อ</th>
                        <th>นามสกุล</th>
                        <th>สถานะ</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="4">กำลังโหลดข้อมูล...</td>
                        </tr>
                    ) : filteredData.length > 0 ? (
                        filteredData.map((item, index) => (
                            <tr key={index}>
                                <td>{item.tankId}</td> 
                                <td>{item.firstname}</td>
                                <td>{item.lastname}</td>
                                <td className={item.status === "เชื่อมต่ออยู่" ? "status-connected" : "status-disconnected"}>
                                    {item.status}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">ไม่พบข้อมูลที่ตรงกับคำค้นหา</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Connection;
