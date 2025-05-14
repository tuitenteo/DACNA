import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import * as XLSX from "xlsx";

const SoSanhBaoGia = () => {
    const [companyData, setCompanyData] = useState([]); // Lưu dữ liệu từ nhiều công ty

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const binaryStr = e.target.result;
            const workbook = XLSX.read(binaryStr, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

            // Thêm dữ liệu công ty mới vào danh sách
            setCompanyData((prevData) => [
                ...prevData,
                { companyName: file.name, data: sheetData },
            ]);
        };
        reader.readAsBinaryString(file);
    };

    const calculateTotalForCompany = (data) => {
        return data.reduce((total, row) => {
            const thanhTien = parseFloat(row["Thành Tiền (VNĐ)"]?.toString().replace(/,/g, "") || 0);
            return total + thanhTien;
        }, 0);
    };

    const getBestCompanyByTotal = (chartData) => {
        if (chartData.length === 0) return null;

        return chartData.reduce((best, company) => {
            return company.total < best.total ? company : best;
        });
    };

    const getBestCompanyByItem = (companyData) => {
        const itemComparison = {};

        companyData.forEach((company) => {
            company.data.forEach((item) => {
                const itemName = item["Tên Vật Tư"];
                const itemPrice = parseFloat(item["Đơn Giá (VNĐ)"]?.toString().replace(/,/g, "") || 0);

                if (!itemComparison[itemName] || itemPrice < itemComparison[itemName].price) {
                    itemComparison[itemName] = {
                        companyName: company.companyName,
                        price: itemPrice,
                    };
                }
            });
        });

        return itemComparison;
    };

    const chartData = companyData.map((company) => ({
        name: company.companyName,
        total: calculateTotalForCompany(company.data),
    }));

    const bestCompanyByTotal = getBestCompanyByTotal(chartData);
    const bestCompanyByItem = getBestCompanyByItem(companyData);

    return (
        <Box sx={{ padding: "20px" }}>
            <h1>So Sánh Báo Giá</h1>

            {/* Upload file báo giá */}
            <Box sx={{ marginBottom: "20px" }}>
                <h3>Hãy upload file báo giá từ các công ty</h3>
                <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileUpload}
                />
            </Box>

            {/* Hiển thị biểu đồ */}
            <Box sx={{ marginTop: "40px" }}>
                <h3>Biểu Đồ So Sánh Báo Giá</h3>
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart
                            data={chartData}
                            margin={{ top: 20, right: 30, left: 50, bottom: 5 }} // Tăng khoảng cách bên trái
                        >
                            <XAxis dataKey="name" />
                            <YAxis
                                allowDecimals={false}
                                tickFormatter={(value) => value.toLocaleString("vi-VN")}
                            />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="total" fill="#8884d8" name="Tổng Tiền (VNĐ)" />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <Typography variant="body1">Vui lòng upload file báo giá để so sánh.</Typography>
                )}
            </Box>

            {/* Hiển thị đánh giá */}
            <Box sx={{ marginTop: "40px" }}>
                <h3>Đánh Giá</h3>
                {bestCompanyByTotal && (
                    <Typography variant="body1">
                        Công ty có tổng tiền thấp nhất: <strong>{bestCompanyByTotal.name.replace(".xlsx", "")}</strong> với tổng tiền <strong>{bestCompanyByTotal.total.toLocaleString("vi-VN")} VNĐ</strong>.
                    </Typography>
                )}
                <Typography variant="body1" sx={{ marginTop: "20px" }}>
                    Công ty tốt nhất cho từng mặt hàng:
                </Typography>
                <ul>
                    {Object.entries(bestCompanyByItem).map(([itemName, { companyName, price }]) => (
                        <li key={itemName}>
                            {itemName}: <strong>{companyName.replace(".xlsx", "")}</strong> với giá <strong>{price.toLocaleString("vi-VN")} VNĐ</strong>
                        </li>
                    ))}
                </ul>
            </Box>
        </Box>
    );
};

export default SoSanhBaoGia;