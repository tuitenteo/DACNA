import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../App'; // Import UserContext
import { Switch, Typography, Button, Card, Box, Grid } from '@mui/material';

const CaiDat = () => {
    const navigate = useNavigate();
    const { mode, toggleTheme } = useContext(UserContext); // Lấy mode và toggleTheme từ context

    const handleLogout = () => {
        // Xóa thông tin người dùng khỏi localStorage
        localStorage.removeItem('userRole');
        localStorage.removeItem('userToken'); // Nếu có token, xóa luôn
        // Chuyển hướng về trang đăng nhập
        navigate('/login');
    };

    const handleBackup = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/backup', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }); // yêu cầu xác thực token khi thực hiện sao lưu
            const data = await res.json();
            if (data.success) {
                const blob = new Blob([JSON.stringify(data.backup, null, 2)], { type: 'application/json' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'backup-toanbo-kktl.json';
                link.click(); // click để tải 
            } else {
                alert("Không thể sao lưu dữ liệu.");
            }
        } catch (error) {
            console.error("Lỗi khi sao lưu:", error);
            alert("Lỗi khi sao lưu dữ liệu.");
        }
    };

return (
    <Box sx={{ padding: '20px', maxWidth: 600, margin: 'auto' }}>
        <Card sx={{ padding: '20px', boxShadow: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', color: 'primary.main' }}>
                Cài đặt
            </Typography>

            <Box sx={{ marginBottom: '20px' }}>
                <Typography variant="body1" sx={{ marginRight: '10px', display: 'inline-block' }}>
                    Chế độ: {mode === 'light' ? 'Sáng' : 'Tối'}
                </Typography>
                <Switch
                    checked={mode === 'dark'}
                    onChange={toggleTheme} // Gọi hàm toggleTheme khi người dùng thay đổi
                />
            </Box>

            <Grid container spacing={2} justifyContent="center">
                <Grid item>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={handleLogout}
                        sx={{ width: '200px' }} // Chiều rộng nút
                    >
                        Đăng xuất
                    </Button>
                </Grid>
                <Grid item>
                    <Button 
                        variant="outlined" 
                        color="secondary" 
                        onClick={handleBackup} 
                        sx={{ width: '200px' }} // Chiều rộng nút
                    >
                        Sao lưu dữ liệu
                    </Button>
                </Grid>
            </Grid>
        </Card>
    </Box>
);
};
export default CaiDat;