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
    Typography,
    TextField,
} from "@mui/material";

const BaoGia = () => {
    const [materials, setMaterials] = useState([]);
    const [selectedMaterials, setSelectedMaterials] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [searchQuery, setSearchQuery] = useState(""); // Thêm state cho tìm kiếm

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

    useEffect(() => {
        const fetchSuppliers = async () => {
            if (selectedMaterials.length === 0) {
                setSuppliers([]);
                return;
            }
            try {
                const token = localStorage.getItem("token");
                const supplierLists = await Promise.all(
                    selectedMaterials.map(async (idvattu) => {
                        const res = await axios.get(
                            `http://localhost:5000/api/nhacungcap/vattu/${idvattu}`,
                            { headers: { Authorization: `Bearer ${token}` } }
                        );
                        return res.data;
                    })
                );
                let commonSuppliers = supplierLists[0] || [];
                for (let i = 1; i < supplierLists.length; i++) {
                    commonSuppliers = commonSuppliers.filter(sup =>
                        supplierLists[i].some(s => s.idncc === sup.idncc)
                    );
                }
                setSuppliers(commonSuppliers);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách nhà cung cấp:", error);
                setSuppliers([]);
            }
        };
        fetchSuppliers();
    }, [selectedMaterials]);

    const handleMaterialSelection = (id) => {
        setSelectedMaterials((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleSendEmail = async () => {
        if (selectedMaterials.length === 0 || suppliers.length === 0) {
            alert("Vui lòng chọn vật tư và đảm bảo có nhà cung cấp.");
            return;
        }
        const selectedMaterialDetails = materials.filter((m) =>
            selectedMaterials.includes(m.idvattu)
        );
        const materialList = selectedMaterialDetails
            .map((m) => `- ${m.tenvattu}`)
            .join("\n");

        const emailContent = `
Kính gửi Quý Nhà Cung Cấp,

Chúng tôi muốn yêu cầu báo giá cho các vật tư sau:
${materialList}

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

    // Lọc vật tư theo từ khóa tìm kiếm
    const filteredMaterials = materials.filter((material) =>
        material.tenvattu.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(material.idvattu).includes(searchQuery)
    );

    return (
        <Box sx={{ padding: "20px" }}>
            <Typography variant="h4" gutterBottom>Báo Giá</Typography>

            {/* Thanh tìm kiếm vật tư */}
            <Box sx={{ marginBottom: "20px" }}>
                <TextField
                    label="Tìm kiếm vật tư"
                    variant="outlined"
                    fullWidth
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </Box>

            {/* Danh sách vật tư */}
            <Box sx={{ marginBottom: "20px" }}>
                <Typography variant="h6">Chọn Vật Tư</Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Chọn</TableCell>
                            <TableCell>ID</TableCell>
                            <TableCell>Tên Vật Tư</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredMaterials.map((material) => (
                            <TableRow key={material.idvattu}>
                                <TableCell>
                                    <input
                                        type="checkbox"
                                        checked={selectedMaterials.includes(material.idvattu)}
                                        onChange={() => handleMaterialSelection(material.idvattu)}
                                    />
                                </TableCell>
                                <TableCell>{material.idvattu}</TableCell>
                                <TableCell>{material.tenvattu}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>

            {/* Danh sách nhà cung cấp */}
            <Box sx={{ marginBottom: "20px" }}>
                <Typography variant="h6">Nhà Cung Cấp Hỗ Trợ Các Vật Tư Đã Chọn</Typography>
                {suppliers.length === 0 ? (
                    <Typography variant="body2">Không có nhà cung cấp nào phù hợp.</Typography>
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Tên Nhà Cung Cấp</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Số Điện Thoại</TableCell>
                                <TableCell>Địa Chỉ</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {suppliers.map((supplier) => (
                                <TableRow key={supplier.idncc}>
                                    <TableCell>{supplier.tenncc}</TableCell>
                                    <TableCell>{supplier.email}</TableCell>
                                    <TableCell>{supplier.sodienthoai}</TableCell>
                                    <TableCell>{supplier.diachi}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </Box>

            {/* Gửi email */}
            <Box>
                <Button
                    variant="contained"
                    color="primary"
                    disabled={selectedMaterials.length === 0 || suppliers.length === 0}
                    onClick={handleSendEmail}
                >
                    Gửi Yêu Cầu Báo Giá
                </Button>
            </Box>
        </Box>
    );
};

export default BaoGia;