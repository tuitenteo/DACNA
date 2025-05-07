import React, { useState, useEffect } from "react";
import axios from "axios";
import SortByAlphaIcon from "@mui/icons-material/SortByAlpha"; // Import icon sắp xếp
import "../styles/TonKho.css";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  TablePagination,
} from "@mui/material";
import { formatDateToDDMMYYYY } from "../utils/utils";

const TonKho = () => {
  const [tonKhoData, setTonKhoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Tìm kiếm
  const [sortOrder, setSortOrder] = useState("asc"); // Sắp xếp
  const [view, setView] = useState("all"); // Quản lý chế độ hiển thị
  const [rowsPerPage, setRowsPerPage] = useState(10); // Số dòng hiển thị
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại

  useEffect(() => {
    const fetchTonKho = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/tonkho", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log("Tồn kho:", token); // Log dữ liệu nhận được
        setTonKhoData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching inventory data:", err);
        setError("Có lỗi xảy ra khi lấy dữ liệu tồn kho.");
        setLoading(false);
      }
    };

    fetchTonKho();
  }, []);

  const getExpiringSoon = (ngayHetHan) => {
    if (!ngayHetHan) return false;
    const today = new Date();
    const expiryDate = new Date(ngayHetHan);
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 14 && diffDays >= 0;
  };

  const getExpired = (ngayHetHan) => {
    if (!ngayHetHan) return false;
    const today = new Date();
    const expiryDate = new Date(ngayHetHan);
    return expiryDate < today;
  };
  
  if (loading) {
    return <p>Đang tải dữ liệu...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  // Lọc danh sách dựa trên từ khóa tìm kiếm
  const filteredTonKhoData = tonKhoData.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.tenvattu?.toLowerCase().includes(query) ||
      item.tendanhmuc?.toLowerCase().includes(query)
    );
  });

  // Sắp xếp danh sách theo bảng chữ cái
  const sortedTonKhoData = filteredTonKhoData.sort((a, b) => {
    if (sortOrder === "asc") {
      return a.tenvattu.localeCompare(b.tenvattu);
    } else {
      return b.tenvattu.localeCompare(a.tenvattu);
    }
  });

  // Lọc dữ liệu theo chế độ hiển thị
  const getViewData = () => {
    if (view === "sapHetHan") {
      return sortedTonKhoData.filter((item) =>
        getExpiringSoon(item.ngayhethan)
      );
    }
    if (view === "daHetHan") {
      return sortedTonKhoData.filter((item) => getExpired(item.ngayhethan));
    }
    if (view === "soLuongIt") {
      return sortedTonKhoData.filter(
        (item) =>
          Number(item.tonkhohientai) > 0 && Number(item.tonkhohientai) < 30
      );
    }
    if (view === "tonKhoDu") {
      return sortedTonKhoData.filter((item) =>
        Number(item.tonkhohientai) >= 30 && // Tồn kho >= 30
        !getExpired(item.ngayhethan) && // Không hết hạn
        !getExpiringSoon(item.ngayhethan) // Không sắp hết hạn
  ); // Tồn kho ổn định
    }
    if (view === "hetVatTu") {
      return sortedTonKhoData.filter(
        (item) => Number(item.tonkhohientai) === 0
      );
    }
    return sortedTonKhoData;
  };


  const viewData = getViewData();

  // Tính toán dữ liệu phân trang
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedViewData = viewData.slice(
    startIndex,
    startIndex + rowsPerPage
  );
  // const totalPages = Math.ceil(viewData.length / rowsPerPage);

  const getRowClass = (item) => {
    if (getExpired(item.ngayhethan)) return "da-het-han"; // Đã hết hạn
    if (Number(item.tonkhohientai) === 0) return "het-vat-tu"; // Hết vật tư
    if (getExpiringSoon(item.ngayhethan)) return "sap-het-han"; // Sắp hết hạn: Màu cam
    if (Number(item.tonkhohientai) > 0 && Number(item.tonkhohientai) < 30)
      return "ton-kho-it"; // Tồn kho ít nhưng > 0
    return "ton-kho-du"; // Tồn kho đủ/ổn định: Màu xanh lá
  };
  return (
    <div>
      <h1>Tồn Kho</h1>

      {/* Thanh tìm kiếm và sắp xếp */}
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}
      >
        {/* Input tìm kiếm */}
        <input
          type="text"
          placeholder="Tìm kiếm vật tư..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: "10px",
            width: "500px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            marginRight: "10px",
          }}
        />

        {/* Nút sắp xếp */}
        <button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          style={{
            padding: "10px",
            cursor: "pointer",
            background: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SortByAlphaIcon
            style={{
              transform:
                sortOrder === "asc" ? "rotate(0deg)" : "rotate(180deg)",
            }}
          />
        </button>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between", // Căn đều các phần tử
          marginBottom: "20px",
        }}
      >
        {/* Dropdown chọn chế độ hiển thị */}
        <select
          value={view}
          onChange={(e) => setView(e.target.value)}
          style={{
            padding: "10px",
            marginBottom: "1px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >
          <option value="all">Hiển thị toàn bộ</option>
          <option value="tonKhoDu" className="ton-kho-du">
            Ổn định
          </option>
          <option value="soLuongIt" className="ton-kho-it">
            Tồn kho ít
          </option>
          <option value="sapHetHan" className="sap-het-han">
            Sắp hết hạn
          </option>
          <option value="daHetHan" className="da-het-han">
            Đã hết hạn
          </option>
          <option value="hetVatTu" className="het-vat-tu">
            Hết vật tư
          </option>
        </select>
      </div>

      {/* Bảng tồn kho */}
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID Vật Tư</TableCell>
              <TableCell>Tên Vật Tư</TableCell>
              <TableCell>Danh Mục</TableCell>
              <TableCell>Ngày Hết Hạn</TableCell>
              <TableCell>Tổng Nhập</TableCell>
              <TableCell>Tổng Xuất</TableCell>
              <TableCell>Tồn Kho Hiện Tại</TableCell>
              <TableCell>Tồn kho thực tế</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedViewData.map((item) => (
              <TableRow key={item.idvattu} className={getRowClass(item)}>
                <TableCell>{item.idvattu}</TableCell>
                <TableCell>{item.tenvattu}</TableCell>
                <TableCell>{item.tendanhmuc || "Không xác định"}</TableCell>
                <TableCell>{formatDateToDDMMYYYY(item.ngayhethan)}</TableCell>
                <TableCell>{item.tongnhap}</TableCell>
                <TableCell>{item.tongxuat}</TableCell>
                <TableCell>{item.tonkhohientai}</TableCell>
                <TableCell>{item.tonkhothucte || "Không xác định"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Phân trang */}
      <TablePagination
        component="div"
        count={viewData.length}
        page={currentPage - 1}
        onPageChange={(e, newPage) => setCurrentPage(newPage + 1)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => setRowsPerPage(Number(e.target.value))}
        labelRowsPerPage="Số dòng"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} trên ${count !== -1 ? count : `nhiều hơn ${to}`}`
        }
      />
    </div>
  );
};

export default TonKho;
