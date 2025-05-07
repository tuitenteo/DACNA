import React, { createContext, useState, useMemo} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import DangNhap from './components/DangNhap';
import BangDieuHuong from './components/BangDieuHuong';
import QuenMatKhau from './components/QuenMatKhau';
import { getTheme } from './components/theme';

export const UserContext = createContext(); // Đảm bảo export đúng

function App() {
  const [mode, setMode] = useState(localStorage.getItem("themeMode") || "light");
  const [currentUser, setCurrentUser] = useState(null);

  const toggleTheme = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("themeMode", newMode);
  };

  const theme = useMemo(() => getTheme(mode), [mode]);

  const loginUser = (user) => setCurrentUser(user);


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserContext.Provider value={{ currentUser, loginUser, mode, toggleTheme }}>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<DangNhap />} />
            <Route path="/quenmatkhau" element={<QuenMatKhau />} />
            <Route path="/dashboard/*" element={<BangDieuHuong />} />
          </Routes>
        </Router>
      </UserContext.Provider>
    </ThemeProvider>
  );
}

export default App;