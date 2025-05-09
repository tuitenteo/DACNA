import React, { useState } from "react";
import { Box, Table, TableHead, TableRow, TableCell, TableBody, Typography } from "@mui/material";
import * as XLSX from "xlsx";

const SoSanhBaoGia = () => {
    const [data1, setData1] = useState([]);
    const [data2, setData2] = useState([]);

    const handleFileUpload = (event, setData) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const binaryStr = e.target.result;
            const workbook = XLSX.read(binaryStr, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
            setData(sheetData);
        };
        reader.readAsBinaryString(file);
    };

    const getCellStyle = (value1, value2) => {
        if (value1 > value2) return { color: "red" }; // Giá trị cao hơn
        if (value1 < value2) return { color: "green" }; // Giá trị thấp hơn
        return {}; // Giá trị bằng nhau
    };

    const calculateTotal = (data) => {
        return data.reduce((total, row) => {
            const thanhTien = parseFloat(row["Thành Tiền (VNĐ)"]?.toString().replace(/,/g, "") || 0);
            return total + thanhTien;
        }, 0);
    };

    const total1 = calculateTotal(data1);
    const total2 = calculateTotal(data2);

    return (
        <Box sx={{ padding: "20px" }}>
            <h1>So Sánh Báo Giá</h1>

            {/* Upload file báo giá từ công ty 1 */}
            <Box sx={{ marginBottom: "20px" }}>
                <h3>Hãy upload file báo giá từ Công Ty 1</h3>
                <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={(e) => handleFileUpload(e, setData1)}
                />
            </Box>

            {/* Upload file báo giá từ công ty 2 */}
            <Box sx={{ marginBottom: "20px" }}>
                <h3>Hãy upload file báo giá từ Công Ty 2</h3>
                <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={(e) => handleFileUpload(e, setData2)}
                />
            </Box>

            {/* Hiển thị dữ liệu từ Công Ty 1 */}
            <Box sx={{ marginBottom: "20px" }}>
                <h3>Báo Giá Công Ty 1</h3>
                <Table>
                    <TableHead>
                        <TableRow>
                            {data1.length > 0 &&
                                Object.keys(data1[0]).map((key) => (
                                    <TableCell key={key}>{key}</TableCell>
                                ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data1.map((row, index) => (
                            <TableRow key={index}>
                                {Object.entries(row).map(([key, value], i) => (
                                    <TableCell
                                        key={i}
                                        sx={
                                            key === "Đơn Giá (VNĐ)" || key === "Thành Tiền (VNĐ)"
                                                ? getCellStyle(
                                                      value,
                                                      data2[index]?.[key] || 0
                                                  )
                                                : {}
                                        }
                                    >
                                        {value}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                        {/* Hiển thị tổng tiền */}
                        <TableRow>
                            <TableCell colSpan={Object.keys(data1[0] || {}).length - 1}>
                                <strong>Tổng Tiền</strong>
                            </TableCell>
                            <TableCell
                                sx={{
                                    fontWeight: "bold",
                                    ...getCellStyle(total1, total2), // Áp dụng màu sắc
                                }}
                            >
                                {total1.toLocaleString("vi-VN")} VNĐ
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Box>

            {/* Hiển thị dữ liệu từ Công Ty 2 */}
            <Box sx={{ marginBottom: "20px" }}>
                <h3>Báo Giá Công Ty 2</h3>
                <Table>
                    <TableHead>
                        <TableRow>
                            {data2.length > 0 &&
                                Object.keys(data2[0]).map((key) => (
                                    <TableCell key={key}>{key}</TableCell>
                                ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data2.map((row, index) => (
                            <TableRow key={index}>
                                {Object.entries(row).map(([key, value], i) => (
                                    <TableCell
                                        key={i}
                                        sx={
                                            key === "Đơn Giá (VNĐ)" || key === "Thành Tiền (VNĐ)"
                                                ? getCellStyle(
                                                      value,
                                                      data1[index]?.[key] || 0
                                                  )
                                                : {}
                                        }
                                    >
                                        {value}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                        {/* Hiển thị tổng tiền */}
                        <TableRow>
                            <TableCell colSpan={Object.keys(data2[0] || {}).length - 1}>
                                <strong>Tổng Tiền</strong>
                            </TableCell>
                            <TableCell
                                sx={{
                                    fontWeight: "bold",
                                    ...getCellStyle(total2, total1), // so sánh và áp màu
                                }}
                            >
                                {total2.toLocaleString("vi-VN")} VNĐ
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Box>

            {/* So sánh tổng tiền */}
            <Box sx={{ marginTop: "20px" }}>
                <Typography variant="h6">
                    Đánh giá:{" "}
                    <span style={getCellStyle(total1, total2)}>
                        {total1 > total2
                            ? "Công Ty 1 có tổng tiền cao hơn"
                            : total1 < total2
                            ? "Công Ty 2 có tổng tiền cao hơn"
                            : "Hai công ty có tổng tiền bằng nhau"}
                    </span>
                </Typography>
            </Box>
        </Box>
    );
};

export default SoSanhBaoGia;