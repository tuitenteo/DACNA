import React, { useState, useEffect } from "react";
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
  TablePagination,
} from "@mui/material";

const LichSuThanhToan = () => {
  const [lichSuThanhToan, setLichSuThanhToan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Số dòng hiển thị mỗi trang
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại

  useEffect(() => {
    const fetchLichSuThanhToan = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/lich-su-thanh-toan",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setLichSuThanhToan(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Lỗi khi lấy lịch sử thanh toán:", err);
        setError("Có lỗi xảy ra khi lấy lịch sử thanh toán.");
        setLoading(false);
      }
    };

    fetchLichSuThanhToan();
  }, []);

  if (loading) {
    return <p>Đang tải dữ liệu...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  // Lọc và phân trang danh sách lịch sử thanh toán
  const paginatedLichSuThanhToan = lichSuThanhToan.slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Lịch Sử Thanh Toán
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã Lô Hàng</TableCell>
              <TableCell>Số Tiền Thanh Toán (VNĐ)</TableCell>
              <TableCell>Mô Tả</TableCell>
              <TableCell>Ngày Thanh Toán</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedLichSuThanhToan.map((thanhToan) => (
              <TableRow key={thanhToan.idthanhtoan}>
                <TableCell>{thanhToan.idlohang}</TableCell>
                <TableCell>
                  {thanhToan.sotienthanhtoan.toLocaleString("vi-VN")}
                </TableCell>
                <TableCell>{thanhToan.mota || "Không có mô tả"}</TableCell>
                <TableCell>
                  {new Date(thanhToan.ngaythanhtoan).toLocaleDateString(
                    "vi-VN"
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Phân trang */}
      <TablePagination
        component="div"
        count={lichSuThanhToan.length}
        page={currentPage}
        onPageChange={(e, newPage) => setCurrentPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) =>
          setRowsPerPage(parseInt(e.target.value, 10))
        }
        labelRowsPerPage="Số dòng"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} trên ${count !== -1 ? count : `nhiều hơn ${to}`}`
        }
      />
    </Box>
  );
};

export default LichSuThanhToan;
