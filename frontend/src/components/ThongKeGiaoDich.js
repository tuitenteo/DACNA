import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Đăng ký chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ThongKeGiaoDich = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/thongke-nhapxuat', {
          headers: {
            Authorization: `Bearer ${token}` // Gửi token
          }
        });
        console.log('Thống kê giao dịch:', token);
        const data = response.data;

        const labels = data.map(item => item.thang);
        const nhapData = data.map(item => item.tong_nhap);
        const xuatData = data.map(item => item.tong_xuat);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Tổng Nhập Kho',
              data: nhapData,
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
            },
            {
              label: 'Tổng Xuất Kho',
              data: xuatData,
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
            },
          ],
        });
      } catch (err) {
        console.error('Lỗi khi lấy dữ liệu biểu đồ:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>Thống kê Nhập/Xuất Kho theo Tháng</h2>
      {chartData ? (
        <div style={{ width: '1000px', height: '600px', margin: '0 auto' }}>
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Biểu đồ Nhập/Xuất Kho theo tháng',
                },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Tháng',
                  },
                },
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Số lượng',
                  },
                },
              },
            }}
          />
        </div>
      ) : (
        <p style={{ textAlign: 'center' }}>Đang tải dữ liệu...</p>
      )}
    </div>
  );
};

export default ThongKeGiaoDich;
