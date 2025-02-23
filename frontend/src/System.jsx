import React, { useState, useEffect } from "react";
import axios from "axios";
import "./System.css";

const SystemDatabase = () => {
  const [users, setUsers] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/users");
      setUsers(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("API Error:", error.response?.data || error.message);
        alert("ไม่สามารถดึงข้อมูลผู้ใช้ได้ กรุณาลองใหม่ภายหลัง");
      } else {
        console.error("Unknown Error:", error);
      }
    }
  };

  const deleteUser = async () => {
    if (!selectedUser) return;
    setShowConfirm(false);
    try {
      await axios.post("http://localhost:8000/users/delete", { userId: selectedUser.userId });
      await getUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("เกิดข้อผิดพลาดในการลบบัญชีผู้ใช้ กรุณาลองใหม่ภายหลัง");
    }
  };

  const confirmDelete = (user) => {
    setSelectedUser(user);
    setShowConfirm(true);
  };

  const cancelDelete = () => {
    setShowConfirm(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      getUsers();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ paddingTop: "20px" }}>
      <h2 className="table-title">การจัดการผู้ใช้แอพพลิเคชัน</h2>
      {users.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>รหัสถังปลูก</th>
              <th>ชื่อ</th>
              <th>นามสกุล</th>
              <th>การดำเนินการ</th>
            </tr>
          </thead>
          <tbody id="userTable">
            {users.flatMap((user) =>
              user.connections.map((conn, index) => (
                <tr key={`${user.userId}-${conn.tankId}-${index}`}>
                  <td>{conn.tankId}</td>
                  <td>{user.firstname}</td>
                  <td>{user.lastname}</td>
                  <td>
                    <button
                      className="delete-button"
                      onClick={() => confirmDelete({ name: `${user.firstname} ${user.lastname}`, userId: user.userId })}
                    >
                      ยกเลิกบัญชี
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      ) : (
        <p>ไม่มีผู้ใช้งานในขณะนี้</p>
      )}

      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal-box">
            <p>คุณต้องการยกเลิกบัญชี <strong>{selectedUser.name}</strong> หรือไม่ ?</p>
            <div className="modal-buttons">
              <button className="confirm-button" onClick={deleteUser}>ยืนยัน</button>
              <button className="cancel-button" onClick={cancelDelete}>ยกเลิก</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemDatabase;
