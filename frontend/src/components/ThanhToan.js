import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Box,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Typography,
    Paper,
    TableContainer,
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";

const ThanhToan = () => {
    const [loHangList, setLoHangList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedLoHang, setSelectedLoHang] = useState(null);
    const [soTienThanhToan, setSoTienThanhToan] = useState("");
    const [moTa, setMoTa] = useState("");
    const [searchQuery, setSearchQuery] = useState(""); // State để lưu giá trị tìm kiếm
    const navigate = useNavigate();

    useEffect(() => {
        const fetchThanhToan = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:5000/api/thanh-toan", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // Chuyển đổi congno và sotienthanhtoan sang số
                const data = response.data.map((loHang) => ({
                    ...loHang,
                    congno: parseFloat(loHang.congno), // Chuyển congno sang số
                    sotienthanhtoan: parseFloat(loHang.sotienthanhtoan), // Chuyển sotienthanhtoan sang số
                }));

                setLoHangList(data);
                setLoading(false);
            } catch (err) {
                console.error("Lỗi khi lấy danh sách thanh toán:", err);
                setError("Có lỗi xảy ra khi lấy danh sách thanh toán.");
                setLoading(false);
            }
        };

        fetchThanhToan();
    }, []);

    const handleOpenDialog = (loHang) => {
        setSelectedLoHang(loHang);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedLoHang(null);
        setSoTienThanhToan("");
        setMoTa("");
    };

    const handleThanhToan = async () => {
        if (!soTienThanhToan || parseInt(soTienThanhToan) <= 0) {
            alert("Số tiền thanh toán phải lớn hơn 0.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            await axios.post(
                "http://localhost:5000/api/thanh-toan",
                {
                    idlohang: selectedLoHang.idlohang,
                    sotienthanhtoan: parseInt(soTienThanhToan),
                    mota: moTa,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            alert("Thanh toán thành công!");
            handleCloseDialog();
            // Cập nhật lại danh sách lô hàng
            const response = await axios.get("http://localhost:5000/api/thanh-toan", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setLoHangList(response.data);
        } catch (err) {
            console.error("Lỗi khi thanh toán:", err);
            alert("Có lỗi xảy ra khi thanh toán.");
        }
    };

    if (loading) {
        return <p>Đang tải dữ liệu...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    // Lọc danh sách lô hàng theo mã lô hàng
    const filteredLoHangList = loHangList.filter((loHang) =>
        loHang.idlohang.toString().includes(searchQuery.trim())
    );

    return (
        <Box sx={{ padding: "20px" }}>
            <h1 style={{ textAlign: "center" }}>Thanh Toán Lô Hàng</h1>

            {/* Nút chuyển đến Lịch Sử Thanh Toán */}
            <Box sx={{ marginBottom: "20px", textAlign: "right" }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/dashboard/lich-su-thanh-toan")}
                >
                    Xem Lịch Sử Thanh Toán
                </Button>
            </Box>

            {/* Ô tìm kiếm */}
            <Box sx={{ marginBottom: "20px" }}>
                <TextField
                    label="Tìm kiếm theo Mã Lô Hàng"
                    variant="outlined"
                    fullWidth
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Mã Lô Hàng</TableCell>
                            <TableCell>Tổng Tiền (VNĐ)</TableCell>
                            <TableCell>Đã Thanh Toán (VNĐ)</TableCell>
                            <TableCell>Công Nợ (VNĐ)</TableCell>
                            <TableCell>Hành Động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredLoHangList.map((loHang) => (
                            <TableRow key={loHang.idlohang}>
                                <TableCell>{loHang.idlohang}</TableCell>
                                <TableCell>{loHang.tongtien.toLocaleString("vi-VN")}</TableCell>
                                <TableCell>{loHang.sotienthanhtoan.toLocaleString("vi-VN")}</TableCell>
                                <TableCell
                                    sx={{
                                        color: loHang.congno > 0 ? "red" : "green",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {loHang.congno.toLocaleString("vi-VN")}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleOpenDialog(loHang)}
                                        disabled={loHang.congno === 0} // Disable nếu công nợ bằng 0
                                    >
                                        Thanh Toán
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog thanh toán */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Thanh Toán Lô Hàng</DialogTitle>
                <DialogContent>
                    <Typography gutterBottom>
                        Mã Lô Hàng: {selectedLoHang?.idlohang}
                    </Typography>
                    <Typography gutterBottom>
                        Công Nợ: {selectedLoHang?.congno.toLocaleString("vi-VN")} VNĐ
                    </Typography>
                    <TextField
                        label="Số Tiền Thanh Toán"
                        type="number"
                        fullWidth
                        value={soTienThanhToan}
                        onChange={(e) => setSoTienThanhToan(e.target.value)}
                        sx={{ marginBottom: "20px" }}
                    />
                    <TextField
                        label="Mô Tả"
                        multiline
                        rows={3}
                        fullWidth
                        value={moTa}
                        onChange={(e) => setMoTa(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Hủy</Button>
                    <Button variant="contained" color="primary" onClick={handleThanhToan}>
                        Thanh Toán
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ThanhToan;