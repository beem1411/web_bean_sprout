import React from "react";
import { useNavigate, Link } from "react-router-dom"; // Import Link
import "./Menu.css";

const Menu = ({ username = "Admin", onLogout }) => {
  const navigate = useNavigate(); // ใช้ useNavigate เพื่อเปลี่ยนเส้นทาง

  const handleLogout = () => {
    if (onLogout) {
      onLogout(); // เรียกฟังก์ชัน onLogout หากถูกส่งเข้ามา
    }
    navigate("/login"); // เปลี่ยนเส้นทางไปยังหน้าเข้าสู่ระบบ
  };

  const menuItems = [
    { id: 1, name: "จัดการผู้ใช้แอปพลิเคชัน", link: "/System" },
    { id: 2, name: "สถานะผู้ใช้แอปพลิเคชัน", link: "/Connection" },
    { id: 3, name: "ตั้งค่าเบื้องต้น", link: "/Settings" },
    { id: 4, name: "จำนวนผู้ใช้ถังปลูก", link: "/Account" },
    { id: 5, name: "ประวัติการปลูก", link: "/History" },
  ];

  return (
    <div className="menu-container">
      <header className="menu-header">
        <div className="menu-logo">{username || "Admin"}</div>
        <div className="menu-user">
          {username && (
            <button className="logout-button" onClick={handleLogout}>
              ออกจากระบบ
            </button>
          )}
        </div>
      </header>
      <div className="menu-content">
        {menuItems.map((item) => (
          <Link key={item.id} to={item.link} className="menu-item">
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Menu;
