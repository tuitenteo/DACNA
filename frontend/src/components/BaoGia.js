import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Box,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Select,
    MenuItem,
} from "@mui/material";

const BaoGia = () => {
    const [materials, setMaterials] = useState([]); // Danh sách vật tư
    const [suppliers, setSuppliers] = useState([]); // Danh sách nhà cung cấp
    const [selectedMaterial, setSelectedMaterial] = useState(""); // Vật tư được chọn

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("http://localhost:5000/api/vattu", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setMaterials(res.data);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách vật tư:", error);
            }
        };

        fetchMaterials();
    }, []);

    const fetchSuppliersByMaterial = async (materialId) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(
                `http://localhost:5000/api/nhacungcap/vattu/${materialId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setSuppliers(res.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách nhà cung cấp theo vật tư:", error);
        }
    };

    const handleMaterialChange = (materialId) => {
        setSelectedMaterial(materialId);
        if (materialId) {
            fetchSuppliersByMaterial(materialId);
        } else {
            setSuppliers([]); // Xóa danh sách nhà cung cấp nếu không chọn vật tư
        }
    };

    const handleSendEmail = async () => {
        if (!selectedMaterial || suppliers.length === 0) {
            alert("Vui lòng chọn vật tư và đảm bảo có nhà cung cấp.");
            return;
        }

        const material = materials.find((m) => m.idvattu === selectedMaterial);

        const emailContent = `
  Kính gửi Quý Nhà Cung Cấp,

  Chúng tôi muốn yêu cầu báo giá cho vật tư sau:
  - ${material.tenvattu}

  Trân trọng,
  Công ty KKTL
        `;

        try {
            const token = localStorage.getItem("token");
            await Promise.all(
                suppliers.map((supplier) =>
                    axios.post(
                        "http://localhost:5000/api/send-email",
                        {
                            email: supplier.email,
                            subject: "Yêu cầu báo giá vật tư",
                            message: emailContent,
                        },
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    )
                )
            );
            alert("Email đã được gửi đến tất cả nhà cung cấp.");
        } catch (error) {
            console.error("Lỗi khi gửi email:", error);
            alert("Không thể gửi email.");
        }
    };

    return (
        <Box sx={{ padding: "20px" }}>
            <h1>Báo Giá</h1>

            {/* Chọn vật tư */}
            <Box sx={{ marginBottom: "20px" }}>
                <h3>Chọn Vật Tư</h3>
                <Select
                    value={selectedMaterial}
                    onChange={(e) => handleMaterialChange(e.target.value)}
                    fullWidth
                >
                    <MenuItem value="">-- Chọn vật tư --</MenuItem>
                    {materials.map((material) => (
                        <MenuItem key={material.idvattu} value={material.idvattu}>
                            {material.tenvattu}
                        </MenuItem>
                    ))}
                </Select>
            </Box>

            {/* Danh sách nhà cung cấp */}
            <Box sx={{ marginBottom: "20px" }}>
                <h3>Danh Sách Nhà Cung Cấp</h3>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Tên Nhà Cung Cấp</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Địa Chỉ</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {suppliers.map((supplier) => (
                            <TableRow key={supplier.idncc}>
                                <TableCell>{supplier.idncc}</TableCell>
                                <TableCell>{supplier.tenncc}</TableCell>
                                <TableCell>{supplier.email}</TableCell>
                                <TableCell>{supplier.diachi}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>

            {/* Gửi email */}
            <Box>
                <Button
                    variant="contained"
                    color="primary"
                    disabled={!selectedMaterial || suppliers.length === 0}
                    onClick={handleSendEmail}
                >
                    Gửi Yêu Cầu Báo Giá
                </Button>
            </Box>
        </Box>
    );
};

export default BaoGia;