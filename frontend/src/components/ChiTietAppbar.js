import React, { useEffect, useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import axios from "axios";

const ChiTietAppbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [newTransactions, setNewTransactions] = useState([]);
  const [seenIds, setSeenIds] = useState([]);
  const [isSeenIdsLoaded, setIsSeenIdsLoaded] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(false); // Trạng thái có tin mới hay không

  const userId = localStorage.getItem("userId"); //  lưu userId vào localStorage khi login
  const seenKey = `seenIds_${userId}`; // thông báo đã đọc phải đc ghi nhớ theo từng user

  useEffect(() => {
    if (!isSeenIdsLoaded) return;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/lichsugiaodich", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = res.data;

        // Gán trạng thái `read` dựa trên `seenIds`
        const processedData = data
          .map((gd) => ({
            ...gd,
            read: seenIds.includes(gd.idgiaodich),
          }))
          .sort((a, b) => {
            // Ưu tiên chưa đọc lên trước
            if (a.read !== b.read) return a.read - b.read;
            // Nếu cả hai đã đọc hoặc chưa đọc, sắp xếp theo ngày giao dịch mới nhất
            return new Date(b.ngaygiaodich) - new Date(a.ngaygiaodich);
          });

        // Cập nhật trạng thái có thông báo mới
        setNewTransactions(processedData);

        // ktr có đọc chưa
        const newOnes = processedData.filter((gd) => !gd.read);
        setHasNewNotifications(newOnes.length > 0);
      } catch (err) {
        console.error("Lỗi lấy giao dịch:", err);
      }
    };

    if (isSeenIdsLoaded) {
      fetchData();
      const interval = setInterval(fetchData, 2000);
      return () => clearInterval(interval);
    }
  }, [seenIds, isSeenIdsLoaded]);

  //mới sửa
  useEffect(() => {
    const stored = localStorage.getItem(seenKey || "seenIds");
    if (stored) {
      const parsedIds = JSON.parse(stored).map((id) => parseInt(id)); // Đảm bảo là số
      setSeenIds(parsedIds);
    } else {
      const emptyIds = [];
      localStorage.setItem(seenKey || "seenIds", JSON.stringify(emptyIds)); // Lưu vào key phù hợp
      setSeenIds(emptyIds);
    }
    setIsSeenIdsLoaded(true); // Đặt thành true ngay cả khi không có dữ liệu
  }, [seenKey]);

  // lưu seenid vào đúng key khi đánh dấu đã đọc
  useEffect(() => {
    if (seenIds.length > 0 && userId) {
      localStorage.setItem(seenKey, JSON.stringify(seenIds));
    }
  }, [seenIds, userId, seenKey]);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  //mới sửa
  const handleNotificationClick = (id) => {
    // Đánh dấu giao dịch là đã xem (đọc)
    setSeenIds((prev) => {
      const updatedSeenIds = Array.from(new Set([...prev, id])); // Thêm ID vào danh sách đã xem
      localStorage.setItem(seenKey, JSON.stringify(updatedSeenIds)); // Lưu vào localStorage
      return updatedSeenIds;
    });

    // Cập nhật trạng thái 'read' mà không thay đổi vị trí
    setNewTransactions((prev) => {
      // Duy trì vị trí thông báo nhưng chỉ thay đổi trạng thái read
      return prev.map((gd) =>
        gd.idgiaodich === id ? { ...gd, read: true } : gd
      );
    });
  };

  const handleClose = () => setAnchorEl(null);

  return (
    <Box sx={{ ml: "auto", display: "flex", alignItems: "center" }}>
      <IconButton
        color="primary"
        onClick={handleOpen}
        sx={{
          position: "relative",
          border: "1px solid #ccc",
          borderRadius: "40%",
          padding: "8px",
          "&:hover": { borderColor: "#aaa" },
        }}
      >
        <NotificationsIcon />
        {hasNewNotifications && (
          <Box
            sx={{
              position: "absolute",
              top: 5,
              right: 5,
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: "red",
            }}
          />
        )}
      </IconButton>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {newTransactions.length === 0 ? (
          <MenuItem disabled>Không có giao dịch mới</MenuItem>
        ) : (
          newTransactions.map((giaoDich, index) => (
            <Box key={index}>
              <MenuItem
                onClick={() => handleNotificationClick(giaoDich.idgiaodich)}
              >
                <Box sx={{ position: "relative" }}>
                  <Typography variant="body1" fontWeight="bold">
                    {giaoDich.tenvattu}
                  </Typography>
                  <Typography variant="body2">
                    SL: {giaoDich.soluong}
                  </Typography>
                  <Typography variant="body2">
                    Người thực hiện: {giaoDich.tennguoidung || "Không xác định"}
                  </Typography>
                  <Typography variant="body2">
                    Loại giao dịch: {giaoDich.loaigiaodich}
                  </Typography>
                  <Typography variant="body2">
                    Ngày giao dịch:{" "}
                    {new Date(giaoDich.ngaygiaodich).toLocaleDateString(
                      "vi-VN",
                      { timeZone: "Asia/Ho_Chi_Minh" }
                    )}
                  </Typography>

                  {!giaoDich.read && ( // Hiển thị chấm đỏ nếu giao dịch chưa đọc
                    <Box
                      sx={{
                        position: "absolute",
                        top: 5,
                        right: 5,
                        width: 15,
                        height: 15,
                        borderRadius: "50%",
                        backgroundColor: "red",
                        color: "white",
                        fontSize: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      •
                    </Box>
                  )}
                </Box>
              </MenuItem>
              {/*đường gạch ngang nếu không phải giao dịch cuối cùng */}
              {index < newTransactions.length - 1 && (
                <Divider sx={{ margin: "5px 0" }} />
              )}
            </Box>
          ))
        )}
      </Menu>
    </Box>
  );
};

export default ChiTietAppbar;
