import React, { useState, useEffect } from "react";
import axios from "axios";
import XuatKhoPdf from "./XuatKhoPdf";
import DanhSachXuatKho from "./DanhSachXuatKho";
import { Dialog, DialogTitle, DialogContent, Button, Box } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const XuatKho = () => {
  const [NguoiYeuCau, setNguoiYeuCau] = useState("");
  const [IDNguoiDung, setIDNguoiDung] = useState("");
  const [TenNguoiDung, setTenNguoiDung] = useState("");
  const [vatTuGroups, setVatTuGroups] = useState([
    { IDVatTu: "", TenVatTu: "", SoLuong: "" }, // Nhóm mặc định
  ]);
  const [vatTuList, setVatTuList] = useState([]);
  const [nguoiDungList, setNguoiDungList] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [phieuXuatKho, setPhieuXuatKho] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const vatTuResponse = await axios.get(
          "http://localhost:5000/api/vattu",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const nguoiDungResponse = await axios.get(
          "http://localhost:5000/api/nguoidung",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setVatTuList(vatTuResponse.data);
        setNguoiDungList(nguoiDungResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  const handleVatTuChange = (index, field, value) => {
    const updatedGroups = [...vatTuGroups];
    updatedGroups[index][field] = value;

    if (field === "IDVatTu") {
      const selectedVatTu = vatTuList.find(
        (vt) => vt.idvattu === parseInt(value)
      );
      updatedGroups[index].TenVatTu = selectedVatTu
        ? selectedVatTu.tenvattu
        : "";
    }

    if (field === "TenVatTu") {
      const selectedVatTu = vatTuList.find((vt) => vt.tenvattu === value);
      updatedGroups[index].IDVatTu = selectedVatTu ? selectedVatTu.idvattu : "";
    }

    setVatTuGroups(updatedGroups);
  };

  const handleAddVatTuGroup = () => {
    setVatTuGroups([
      ...vatTuGroups,
      { IDVatTu: "", TenVatTu: "", SoLuong: "" },
    ]);
  };

  const handleRemoveVatTuGroup = (index) => {
    if (vatTuGroups.length > 1) {
      const updatedGroups = vatTuGroups.filter((_, i) => i !== index);
      setVatTuGroups(updatedGroups);
    } else {
      alert("Phải có ít nhất một vật tư!");
    }
  };

  const handleNguoiDungChange = (field, value) => {
    if (field === "IDNguoiDung") {
      setIDNguoiDung(value);
      const selectedNguoiDung = nguoiDungList.find(
        (nd) => nd.idnguoidung === parseInt(value)
      );
      setTenNguoiDung(selectedNguoiDung ? selectedNguoiDung.tendangnhap : "");
    }

    if (field === "TenNguoiDung") {
      setTenNguoiDung(value);
      const selectedNguoiDung = nguoiDungList.find(
        (nd) => nd.tendangnhap === value
      );
      setIDNguoiDung(selectedNguoiDung ? selectedNguoiDung.idnguoidung : "");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setPhieuXuatKho(null);

    try {
      const token = localStorage.getItem("token");
      const data = {
        vatTuGroups: vatTuGroups.map((group) => ({
          IDVatTu: parseInt(group.IDVatTu, 10), // Chuyển đổi sang số
          TenVatTu: group.TenVatTu,
          SoLuong: parseInt(group.SoLuong, 10), // Chuyển đổi sang số
        })),
        NguoiYeuCau,
        IDNguoiDung: parseInt(IDNguoiDung, 10), // Chuyển đổi sang số
      };

      console.log("Dữ liệu gửi đi:", JSON.stringify(data, null, 2)); // Log dữ liệu gửi đi

      const response = await axios.post("http://localhost:5000/xuatkho", data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Xuất kho: ", token);

      if (response.data.success) {
        setMessage(response.data.message);
        setPhieuXuatKho(response.data.data);
        setVatTuGroups([{ IDVatTu: "", TenVatTu: "", SoLuong: "" }]);
        setNguoiYeuCau("");
        setIDNguoiDung("");
        setTenNguoiDung("");
      }
    } catch (err) {
      console.error("Error:", err);
      setError(
        err.response?.data?.message || "Có lỗi xảy ra khi kết nối đến server."
      );
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <h1>Xuất Kho</h1>

      <Button
        variant="contained"
        onClick={() => handleOpen()}
        style={{ background: "#28a745" }}
      >
        <AddCircleOutlineIcon style={{ marginRight: "5px" }} />
        Thêm xuất kho
      </Button>
      <Dialog 
        open={open} 
        onClose={handleClose} 
        fullWidth 
        maxWidth="md"
        >
        <DialogTitle>Thêm Xuất Kho</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            {/* Người yêu cầu */}
            <div>
              <label>Người Yêu Cầu:</label>
              <input
                type="text"
                value={NguoiYeuCau}
                onChange={(e) => setNguoiYeuCau(e.target.value)}
                required
              />
            </div>

            {/* ID Người Dùng */}
            <div>
              <label>ID Người Dùng:</label>
              <select
                value={IDNguoiDung}
                onChange={(e) =>
                  handleNguoiDungChange("IDNguoiDung", e.target.value)
                }
                required
              >
                <option value="">Chọn ID Người Dùng</option>
                {nguoiDungList.map((nd) => (
                  <option key={nd.idnguoidung} value={nd.idnguoidung}>
                    {nd.idnguoidung}
                  </option>
                ))}
              </select>
            </div>

            {/* Tên Người Dùng */}
            <div>
              <label>Tên Người Dùng:</label>
              <select
                value={TenNguoiDung}
                onChange={(e) =>
                  handleNguoiDungChange("TenNguoiDung", e.target.value)
                }
                required
              >
                <option value="">Chọn Tên Người Dùng</option>
                {nguoiDungList.map((nd) => (
                  <option key={nd.idnguoidung} value={nd.tendangnhap}>
                    {nd.tendangnhap}
                  </option>
                ))}
              </select>
            </div>

            {/* Nhóm Vật Tư */}
            {vatTuGroups.map((group, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <div style={{ marginRight: "10px" }}>
                  <label>ID Vật Tư:</label>
                  <select
                    value={group.IDVatTu}
                    onChange={(e) =>
                      handleVatTuChange(index, "IDVatTu", e.target.value)
                    }
                    required
                  >
                    <option value="">Chọn ID Vật Tư</option>
                    {vatTuList.map((vt) => (
                      <option key={vt.idvattu} value={vt.idvattu}>
                        {vt.idvattu}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ marginRight: "10px" }}>
                  <label>Tên Vật Tư:</label>
                  <select
                    value={group.TenVatTu}
                    onChange={(e) =>
                      handleVatTuChange(index, "TenVatTu", e.target.value)
                    }
                    required
                  >
                    <option value="">Chọn Tên Vật Tư</option>
                    {vatTuList.map((vt) => (
                      <option key={vt.idvattu} value={vt.tenvattu}>
                        {vt.tenvattu}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ marginRight: "10px" }}>
                  <label>Số Lượng:</label>
                  <input
                    type="number"
                    value={group.SoLuong}
                    onChange={(e) =>
                      handleVatTuChange(index, "SoLuong", e.target.value)
                    }
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveVatTuGroup(index)}
                >
                  Xóa
                </button>
              </div>
            ))}
            <button type="button" onClick={handleAddVatTuGroup}>
              Thêm Vật Tư
            </button>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
            >
              <Button variant="outlined" onClick={handleClose}>
                Hủy
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Xuất
              </Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {phieuXuatKho && <XuatKhoPdf phieuXuatKho={phieuXuatKho} />}

      {/* Hiển thị danh sách xuất kho */}
      <DanhSachXuatKho />
    </div>
  );
};

export default XuatKho;
