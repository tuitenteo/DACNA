import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";

const NhapKho = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{ padding: "20px" }}>
            <h1>Nhập Kho</h1>

            {/* Nút chuyển sang trang Báo Giá */}
            <Box sx={{ marginBottom: "20px" }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/dashboard/baogia")}
                >
                    Báo Giá
                </Button>
            </Box>

            {/* Nút chuyển sang trang Xem Lô Hàng */}
            <Box sx={{ marginBottom: "20px" }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/dashboard/lohang")}
                >
                    Xem Lô Hàng
                </Button>
            </Box>

            {/* Nút chuyển đến trang Thêm Lô Hàng */}
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/dashboard/them-lo-hang")}
                sx={{ marginBottom: "20px" }}
            >
                Thêm Lô Hàng
            </Button>
        </Box>
    );
};

export default NhapKho;