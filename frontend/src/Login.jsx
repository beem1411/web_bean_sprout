import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "./Login.css";
import axios from "axios";

function Login() {
    const [data, setData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate(); 

    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        });
    };

    const validateInput = () => {
        if (!data.email || !data.password) {
            setError("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(data.email)) {
            setError("รูปแบบอีเมลไม่ถูกต้อง");
            return false;
        }
        return true;
    };

    const login = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        if (!validateInput()) return;

        try {
            setIsLoading(true);
            const res = await axios.post("http://localhost:8000/login", {
                email: data.email,
                password: data.password
                });
            if (res.data.success) {
                setSuccessMessage(res.data.message);
                navigate("/menu"); 
            } else {
                setError(res.data.message);
            }
        } catch (err) {
            setError("ไม่พบบัญชีผู้ใช้");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-icon">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        alt="User Icon"
                        className="user-icon"
                    />
                </div>
                <div className="welcome-text">
                    <h2>ยินดีต้อนรับเข้าสู่ระบบ</h2>
                    <p>ลงชื่อเข้าใช้งาน</p>
                </div>
                <form className="login-form" onSubmit={login}>
                    <input
                        type="text"
                        className="login-input"
                        placeholder="ชื่อผู้ใช้"
                        name="email"
                        value={data.email}
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        className="login-input"
                        placeholder="รหัสผ่าน"
                        name="password"
                        value={data.password}
                        onChange={handleChange}
                    />
                    {error && <p className="error-message">{error}</p>}
                    {successMessage && <p className="success-message">{successMessage}</p>}
                    <button type="submit" className="login-button" disabled={isLoading}>
                        {isLoading ? "กำลังโหลด..." : "เข้าสู่ระบบ"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
