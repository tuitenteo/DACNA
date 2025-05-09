import React, { useState } from "react";
import axios from "axios";
import { Box, Button, Typography, Input } from "@mui/material";

const ThemLoHang = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage("Vui lòng chọn file Excel.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const token = localStorage.getItem("token");
            const res = await axios.post("http://localhost:5000/api/lohang/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });
            setMessage(res.data.message);
        } catch (error) {
            console.error("Lỗi khi upload file:", error);
            setMessage(error.response?.data?.message || "Có lỗi xảy ra.");
        }
    };

    return (
        <Box sx={{ padding: "20px" }}>
            <h1>Thêm Lô Hàng</h1>
            <Input type="file" onChange={handleFileChange} />
            <Button variant="contained" color="primary" onClick={handleUpload} sx={{ marginLeft: "10px" }}>
                Upload
            </Button>
            {message && (
                <Typography variant="body1" color="error" sx={{ marginTop: "10px" }}>
                    {message}
                </Typography>
            )}
        </Box>
    );
};

export default ThemLoHang;