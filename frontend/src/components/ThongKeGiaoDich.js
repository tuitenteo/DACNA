import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Autocomplete, TextField } from "@mui/material";

// Đăng ký chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ThongKeGiaoDich = () => {
  const [chartData, setChartData] = useState(null);
  const [nam, setNam] = useState(new Date().getFullYear()); // Năm hiện tại
  const [thang, setThang] = useState(new Date().getMonth() + 1); // Tháng hiện tại (1-12)

  // Tạo danh sách năm động
  const generateYears = (startYear, endYear) => {
    const years = [];
    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }
    return years;
  };

  const years = generateYears(2023, new Date().getFullYear()); // Từ năm 2020 đến năm hiện tại

  const fetchData = async (selectedNam, selectedThang) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/thongke-nhapxuat",
        {
          headers: {
            Authorization: `Bearer ${token}`, // Gửi token
          },
          params: {
            nam: selectedNam,
            thang: selectedThang,
          },
        }
      );

      console.log("Thống kê giao dịch:", token);
      const data = response.data;

      const labels = data.map((item) => item.thang);
      const nhapData = data.map((item) => item.tong_nhap);
      const xuatData = data.map((item) => item.tong_xuat);

      setChartData({
        labels,
        datasets: [
          {
            label: "Tổng Nhập Kho",
            data: nhapData,
            backgroundColor: "rgba(54, 162, 235, 0.6)",
          },
          {
            label: "Tổng Xuất Kho",
            data: xuatData,
            backgroundColor: "rgba(255, 99, 132, 0.6)",
          },
        ],
      });
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu biểu đồ:", err);
    }
  };

  useEffect(() => {
    fetchData(nam, thang); // Mặc định hiển thị năm và tháng hiện tại
  }, [nam, thang]);

  const handleNamChange = (event, value) => {
    setNam(value);
  };

  const handleThangChange = (event, value) => {
    setThang(value);
  };

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Thống kê Nhập/Xuất Kho theo Tháng</h2>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        <Autocomplete
          options={years} // Danh sách năm
          getOptionLabel={(option) => String(option)} // Chuyển số thành chuỗi
          value={nam}
          onChange={handleNamChange}
          renderInput={(params) => <TextField {...params} label="Chọn Năm" />}
          style={{ width: 200 }}
        />
        <Autocomplete
          options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]} // Danh sách tháng
          getOptionLabel={(option) => String(option)} // Chuyển số thành chuỗi
          value={thang}
          onChange={handleThangChange}
          renderInput={(params) => <TextField {...params} label="Chọn Tháng" />}
          style={{ width: 200 }}
        />
      </div>
      {chartData ? (
        <div style={{ width: "1000px", height: "600px", margin: "0 auto" }}>
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "top",
                },
                title: {
                  display: true,
                  text: `Biểu đồ Nhập/Xuất Kho - Năm ${nam}, Tháng ${thang}`,
                },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: "Tháng",
                  },
                },
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: "Số lượng",
                  },
                },
              },
            }}
          />
        </div>
      ) : (
        <p style={{ textAlign: "center" }}>Đang tải dữ liệu...</p>
      )}
    </div>
  );
};

export default ThongKeGiaoDich;
