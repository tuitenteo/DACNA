import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/QuenMatKhau.css";

const QuenMatKhau = () => {
  const [email, setEmail] = useState("");
  const [thongbao, setThongbao] = useState("");
  const navigate = useNavigate();

  const handleReset = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/quenmatkhau",
        {
          email,
        }
      );
      setThongbao(response.data.message);
    } catch (err) {
      setThongbao(err.response?.data?.message || "Lỗi hệ thống");
    }
  };

  return (
    <div className="pw-page">
      <div className="pw-container">
        <div className="pw-form">
          <h2>Khôi phục mật khẩu</h2>
          <div className="input-group">
          <input
            type="text"
            placeholder="Nhập email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          </div>
          <button onClick={handleReset}>Lấy lại mật khẩu</button>
          <p
            onClick={() => navigate("/login")}
            style={{ color: "blue", cursor: "pointer" }}
          >
            Quay lại trang đăng nhập
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuenMatKhau;
