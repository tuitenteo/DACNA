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
    Typography,
} from "@mui/material";

const BaoGia = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState("");
    const [materials, setMaterials] = useState([]);
    const [selectedMaterials, setSelectedMaterials] = useState([]);

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("http://localhost:5000/api/nhacungcap", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setSuppliers(res.data);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách nhà cung cấp:", error);
            }
        };
        fetchSuppliers();
    }, []);

    const handleSupplierChange = async (supplierId) => {
        setSelectedSupplier(supplierId);
        setSelectedMaterials([]);
        if (supplierId) {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(
                    `http://localhost:5000/api/vattu/nhacungcap/${supplierId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setMaterials(res.data);
            } catch (error) {
                console.error("Lỗi khi lấy vật tư theo nhà cung cấp:", error);
                setMaterials([]);
            }
        } else {
            setMaterials([]);
        }
    };

    const handleMaterialSelection = (id) => {
        setSelectedMaterials((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleSendEmail = async () => {
        if (!selectedSupplier || selectedMaterials.length === 0) {
            alert("Vui lòng chọn nhà cung cấp và ít nhất một vật tư.");
            return;
        }
        const supplier = suppliers.find((s) => s.idncc === selectedSupplier);
        const selectedMaterialDetails = materials.filter((m) =>
            selectedMaterials.includes(m.idvattu)
        );
        const materialList = selectedMaterialDetails
            .map((m) => `- ${m.tenvattu}`)
            .join("\n");

        const emailContent = `
Kính gửi ${supplier.tenncc},

Chúng tôi muốn yêu cầu báo giá cho các vật tư sau:
${materialList}

Trân trọng,
Công ty KKTL
        `;

        try {
            const token = localStorage.getItem("token");
            await axios.post(
                "http://localhost:5000/api/send-email",
                {
                    email: supplier.email,
                    subject: "Yêu cầu báo giá vật tư",
                    message: emailContent,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            alert("Email đã được gửi đến nhà cung cấp.");
        } catch (error) {
            console.error("Lỗi khi gửi email:", error);
            alert("Không thể gửi email.");
        }
    };

    return (
        <Box sx={{ padding: "20px" }}>
            <Typography variant="h4" gutterBottom>Báo Giá</Typography>

            {/* Chọn nhà cung cấp */}
            <Box sx={{ marginBottom: "20px" }}>
                <Typography variant="h6">Chọn Nhà Cung Cấp</Typography>
                <Select
                    value={selectedSupplier}
                    onChange={(e) => handleSupplierChange(e.target.value)}
                    fullWidth
                >
                    <MenuItem value="">-- Chọn nhà cung cấp --</MenuItem>
                    {suppliers.map((supplier) => (
                        <MenuItem key={supplier.idncc} value={supplier.idncc}>
                            {supplier.tenncc}
                        </MenuItem>
                    ))}
                </Select>
            </Box>

            {/* Danh sách vật tư */}
            <Box sx={{ marginBottom: "20px" }}>
                <Typography variant="h6">Danh Sách Vật Tư</Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Chọn</TableCell>
                            <TableCell>ID</TableCell>
                            <TableCell>Tên Vật Tư</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {materials.map((material) => (
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

            {/* Gửi email */}
            <Box>
                <Button
                    variant="contained"
                    color="primary"
                    disabled={!selectedSupplier || selectedMaterials.length === 0}
                    onClick={handleSendEmail}
                >
                    Gửi Yêu Cầu Báo Giá
                </Button>
            </Box>
        </Box>
    );
};

export default BaoGia;