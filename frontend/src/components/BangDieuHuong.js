import React, { useState, Suspense } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Collapse,
  Divider,
  Typography,
  ListItemIcon,
  Alert,
} from "@mui/material";
import {
  Inventory,
  AddBox,
  ExitToApp,
  History,
  People,
  BarChart,
  Settings,
  ExpandLess,
  ExpandMore,
  MenuOpen,
  Menu,
} from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import NguoiDung from "./NguoiDung";
import CaiDat from "./CaiDat";
import DanhMucVatTu from "./DanhMucVatTu";
import XuatKho from "./XuatKho";
import LichSuGiaoDich from "./LichSuGiaoDich";
import ChiTietAppbar from "./ChiTietAppbar";
import TonKho from "./TonKho";
import NhaCungCap from "./NhaCungCap";
import ThongKeGiaoDich from "./ThongKeGiaoDich";
import NhapKho from "./NhapKho";
import ThongBaoTonKho from "./ThongBaoTonKho";
import BaoGia from "./BaoGia";
import SoSanhBaoGia from "./SoSanhBaoGia";
import LoHang from "./LoHang";
import ThemLoHang from "./ThemLoHang";
import ThanhToan from "./ThanhToan";
import LichSuThanhToan from "./thanhtoan/LichSuThanhToan";
import ChatBot from "./ChatBot";
import logo from "../assets/myicon.png";
import { useTheme } from "@mui/material/styles";

const BangDieuHuong = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const [openReports, setOpenReports] = useState(false);
  const userRole = localStorage.getItem("userRole"); // Lấy vai trò từ localStorage
  const drawerWidth = 240;
  const collapsedWidth = 0;
  const theme = useTheme();
  const [showWarnings, setShowWarnings] = useState(true); // set thông báo hiện
  const [warnings, setWarnings] = useState({
    soLuongIt: [],
    sapHetHan: [],
    daHetHan: [],
    hetVatTu: [],
  });
  const handleToggleReports = () => {
    setOpenReports(!openReports);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const getIconColor = (path) =>
    location.pathname.includes(path) ? "#0056B7" : "inherit";

  return (
    <Box sx={{ display: "flex", height: "100vh", flexDirection: "column" }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: theme.palette.background.default, // 2 dòng này dùng cho chỉnh sáng tối
          color: theme.palette.text.primary,
          //backgroundColor: "#ffffff",
          //color: "#123458",
          boxShadow: "none",
          borderBottom: "1px solid #ccc",
          zIndex: (theme) => theme.zIndex.drawer + 1, // Đảm bảo AppBar nằm trên Sidebar
          "&:hover": {
            cursor: "pointer", // Thêm hiệu ứng hover
          },
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            {drawerOpen ? (
              <MenuOpen sx={{ color: "#123458" }} />
            ) : (
              <Menu sx={{ color: "#123458" }} />
            )}
          </IconButton>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              pointerEvents: "none",
            }}
          >
            <img
              src={logo}
              alt="Logo"
              style={{ width: "70px", height: "70px", marginRight: "10px" }}
            />
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: "bold",
                color: "#0056B7",
                fontSize: "30px",
              }}
            >
              KKTL
            </Typography>
          </Box>
          <ChiTietAppbar />
        </Toolbar>
      </AppBar>

      {/* Main layout: Sidebar + Content */}
      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          marginTop: "64px" /* Chiều cao AppBar */,
        }}
      >
        {/* Sidebar (Drawer) */}
        <Drawer
          variant="persistent"
          anchor="left"
          open={drawerOpen}
          sx={{
            width: drawerOpen ? drawerWidth : collapsedWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerOpen ? drawerWidth : collapsedWidth,
              boxSizing: "border-box",
              borderRight: "1px solid #ccc",
              position: "fixed", // Sidebar cố định
              top: "64px", // Đặt dưới AppBar
              height: "calc(100vh - 64px)", // Chiều cao trừ đi AppBar
              overflowY: "auto", // Cho phép cuộn riêng Sidebar
              transition: "none",
            },
          }}
        >
          <List>
            <Box sx={{ marginLeft: 2, marginTop: 2, marginBottom: 0 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Chức năng chính
              </Typography>
            </Box>
            <List>
              <ListItem
                component={Link}
                to="/dashboard/danhmucvattu"
                selected={location.pathname.includes("danhmucvattu")}
              >
                <ListItemIcon>
                  <Inventory sx={{ color: getIconColor("danhmucvattu") }} />
                </ListItemIcon>
                <ListItemText
                  primary="Danh mục vật tư"
                  sx={{ color: theme.palette.text.primary }}
                />
              </ListItem>
              <ListItem
                component={Link}
                to="/dashboard/nhacungcap"
                selected={location.pathname.includes("nhacungcap")}
              >
                <ListItemIcon>
                  <People sx={{ color: getIconColor("nhacungcap") }} />
                </ListItemIcon>
                <ListItemText
                  primary="Nhà cung cấp"
                  sx={{ color: theme.palette.text.primary }}
                />
              </ListItem>
              <ListItem
                component={Link}
                to="/dashboard/nhapkho"
                selected={location.pathname.includes("nhapkho")}
              >
                <ListItemIcon>
                  <AddBox sx={{ color: getIconColor("nhapkho") }} />
                </ListItemIcon>
                <ListItemText
                  primary="Nhập kho"
                  sx={{ color: theme.palette.text.primary }}
                />
              </ListItem>
              <ListItem
                component={Link}
                to="/dashboard/thanh-toan"
                selected={location.pathname.includes("thanh-toan")}
              >
                <ListItemIcon>
                  <BarChart sx={{ color: getIconColor("thanh-toan") }} />
                </ListItemIcon>
                <ListItemText
                  primary="Thanh Toán"
                  sx={{ color: theme.palette.text.primary }}
                />
              </ListItem>
              <ListItem
                component={Link}
                to="/dashboard/xuatkho"
                selected={location.pathname.includes("xuatkho")}
              >
                <ListItemIcon>
                  <ExitToApp sx={{ color: getIconColor("xuatkho") }} />
                </ListItemIcon>
                <ListItemText
                  primary="Xuất kho"
                  sx={{ color: theme.palette.text.primary }}
                />
              </ListItem>
              <ListItem
                component={Link}
                to="/dashboard/lichsugiaodich"
                selected={location.pathname.includes("lichsugiaodich")}
              >
                <ListItemIcon>
                  <History sx={{ color: getIconColor("lichsugiaodich") }} />
                </ListItemIcon>
                <ListItemText
                  primary="Lịch sử giao dịch"
                  sx={{ color: theme.palette.text.primary }}
                />
              </ListItem>
            </List>

            <Divider />

            <Box sx={{ marginLeft: 2, marginTop: 2, marginBottom: 0 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Quản trị & báo cáo
              </Typography>
            </Box>
            <List>
              {/* Hiển thị menu "Người dùng" chỉ khi vai trò là Admin */}
              {userRole === "Admin" && (
                <ListItem
                  component={Link}
                  to="/dashboard/nguoidung"
                  selected={location.pathname.includes("nguoidung")}
                >
                  <ListItemIcon>
                    <People sx={{ color: getIconColor("nguoidung") }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Người dùng"
                    sx={{ color: theme.palette.text.primary }}
                  />
                </ListItem>
              )}

              {/* Báo cáo có submenu */}
              <ListItem onClick={handleToggleReports}>
                <ListItemIcon>
                  <BarChart />
                </ListItemIcon>
                <ListItemText primary="Báo cáo" />
                {openReports ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={openReports} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItem
                    sx={{ pl: 4 }}
                    component={Link}
                    to="/dashboard/tonkho"
                    selected={location.pathname.includes("tonkho")}
                  >
                    <ListItemIcon>
                      <Inventory sx={{ color: getIconColor("tonkho") }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Tồn kho"
                      sx={{ color: theme.palette.text.primary }}
                    />
                  </ListItem>
                  <ListItem
                    sx={{ pl: 4 }}
                    component={Link}
                    to="/dashboard/thongkegiaodich"
                    selected={location.pathname.includes("thongkegiaodich")}
                  >
                    <ListItemIcon>
                      <History
                        sx={{ color: getIconColor("thongkegiaodich") }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary="Thống kê giao dịch"
                      sx={{ color: theme.palette.text.primary }}
                    />
                  </ListItem>
                  <ListItem
                    sx={{ pl: 4 }}
                    component={Link}
                    to="/dashboard/chatbot"
                    selected={location.pathname.includes("chatbot")}
                  >
                    <ListItemIcon>
                      <BarChart sx={{ color: getIconColor("chatbot") }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="AI Analyzer"
                      sx={{ color: theme.palette.text.primary }}
                    />
                  </ListItem>
                </List>
              </Collapse>

              <ListItem
                component={Link}
                to="/dashboard/caidat"
                selected={location.pathname.includes("caidat")}
              >
                <ListItemIcon>
                  <Settings sx={{ color: getIconColor("caidat") }} />
                </ListItemIcon>
                <ListItemText
                  primary="Cài đặt"
                  sx={{ color: theme.palette.text.primary }}
                />
              </ListItem>
            </List>
          </List>
          <Divider />
        </Drawer>

        {/* Content Area */}
        <Box
          sx={{
            flexGrow: 1,
            padding: 1,
            fontSize: "16px",
          }}
        >
          <ThongBaoTonKho onWarningsUpdate={setWarnings} />
          {/* hiển thị thông báo tồn kho và tắt có điều kieẹn */}
          {showWarnings && (
            <Box sx={{ mb: 2 }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6">Thông Báo Tồn Kho</Typography>
                <IconButton size="small" onClick={() => setShowWarnings(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>

              <Collapse in={showWarnings}>
                <div>
                  {warnings.soLuongIt.length > 0 && (
                    <Alert severity="warning" sx={{ mb: 1 }}>
                      Có {warnings.soLuongIt.length} vật tư có số lượng ít.{" "}
                      <Link to="/dashboard/tonkho">Xem chi tiết</Link>
                    </Alert>
                  )}

                  {warnings.sapHetHan.length > 0 && (
                    <Alert severity="warning" sx={{ mb: 1 }}>
                      Có {warnings.sapHetHan.length} vật tư sắp hết hạn.{" "}
                      <Link to="/dashboard/tonkho">Xem chi tiết</Link>
                    </Alert>
                  )}

                  {warnings.daHetHan.length > 0 && (
                    <Alert severity="error" sx={{ mb: 1 }}>
                      Có {warnings.daHetHan.length} vật tư đã hết hạn.{" "}
                      <Link to="/dashboard/tonkho">Xem chi tiết</Link>
                    </Alert>
                  )}

                  {warnings.hetVatTu.length > 0 && (
                    <Alert severity="error" sx={{ mb: 1 }}>
                      Có {warnings.hetVatTu.length} vật tư đã hết hàng.{" "}
                      <Link to="/dashboard/tonkho">Xem chi tiết</Link>
                    </Alert>
                  )}
                </div>
              </Collapse>
            </Box>
          )}
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="nguoidung" element={<NguoiDung />} />
              <Route path="caidat" element={<CaiDat />} />
              <Route path="danhmucvattu" element={<DanhMucVatTu />} />
              <Route path="nhapkho" element={<NhapKho />} />
              <Route path="xuatkho" element={<XuatKho />} />
              <Route path="lichsugiaodich" element={<LichSuGiaoDich />} />
              <Route path="tonkho" element={<TonKho />} />
              <Route path="thongkegiaodich" element={<ThongKeGiaoDich />} />
              <Route path="nhacungcap" element={<NhaCungCap />} />
              <Route path="thongbaotonkho" element={<ThongBaoTonKho />} />
              <Route path="baogia" element={<BaoGia />} />
              <Route path="so-sanh-bao-gia" element={<SoSanhBaoGia />} />
              <Route path="lohang" element={<LoHang />} />
              <Route path="them-lo-hang" element={<ThemLoHang />} />
              <Route path="thanh-toan" element={<ThanhToan />} />
              <Route path="/dashboard/thanh-toan/:idlohang" element={<ThanhToan />} />
              <Route path="lich-su-thanh-toan" element={<LichSuThanhToan />} />
              <Route path="chatbot" element={<ChatBot />} />
            </Routes>
          </Suspense>
        </Box>
      </Box>
    </Box>
  );
};

export default BangDieuHuong;
