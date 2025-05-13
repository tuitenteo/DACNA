import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid, Card, Typography, ButtonBase } from "@mui/material";
import {
  DescriptionOutlined,
  DifferenceOutlined,
  Inventory,
  AddCircle,
} from "@mui/icons-material"; // Import icon

const NhapKho = () => {
  const navigate = useNavigate();

  // Danh sách các chức năng cùng với icon
  const features = [
    {
      label: "Báo Giá",
      link: "/dashboard/baogia",
      icon: <DescriptionOutlined fontSize="large" sx={{ color: "blue" }} />,
      textColor: "blue", // Màu chữ
    },
    {
      label: "So Sánh Báo Giá",
      link: "/dashboard/so-sanh-bao-gia",
      icon: <DifferenceOutlined fontSize="large" sx={{ color: "green" }} />,
      textColor: "green", // Màu chữ
    },
    {
      label: "Xem Lô Hàng",
      link: "/dashboard/lohang",
      icon: <Inventory fontSize="large" sx={{ color: "orange" }} />,
      textColor: "orange", // Màu chữ
    },
    {
      label: "Thêm Lô Hàng",
      link: "/dashboard/them-lo-hang",
      icon: <AddCircle fontSize="large" sx={{ color: "red" }} />,
      textColor: "red", // Màu chữ
    },
  ];

  return (
    <Box sx={{ padding: "40px" }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4 }}>
        Nhập Kho
      </Typography>

      {/* Grid để sắp xếp các chức năng */}
      <Grid container spacing={3} columns={{ xs: 4, sm: 8, md: 12 }}>
        {features.map((item, index) => (
          <Grid
            key={index}
            sx={{
              gridColumn: {
                xs: "span 4", // Chiếm toàn bộ chiều rộng trên màn hình nhỏ
                sm: "span 4", // Chiếm 50% chiều rộng trên màn hình trung bình
                md: "span 3", // Chiếm 25% chiều rộng trên màn hình lớn
              },
            }}
          >
            <ButtonBase
              sx={{ width: "100%" }}
              onClick={() => navigate(item.link)}
            >
              <Card
                sx={{
                  padding: "20px",
                  borderRadius: "16px",
                  boxShadow: 3,
                  textAlign: "center",
                  transition: "0.3s",
                  "&:hover": { boxShadow: 6 },
                }}
              >
                <Box sx={{ mb: 2 }}>{item.icon}</Box> {/* Hiển thị icon */}
                <Typography variant="h6" sx={{ color: item.textColor }}>
                  {" "}
                  {/* Thay đổi màu chữ */}
                  {item.label}
                </Typography>
              </Card>
            </ButtonBase>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default NhapKho;
