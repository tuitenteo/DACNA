import { createTheme } from '@mui/material/styles';

export const getTheme = (mode) => {
    return createTheme({
        palette: {
            mode, // Chế độ sáng hoặc tối
            ...(mode === 'light'
                ? {
                    // Tùy chỉnh cho chế độ sáng
                    background: {
                        default: '#ffffff',
                        paper: '#ffffff',
                    },
                    text: {
                        primary: '#000000',
                    },
                }
                : {
                    // Tùy chỉnh cho chế độ tối
                    background: {
                        default: '#121212',
                        paper: '#1e1e1e',
                    },
                    text: {
                        primary: '#ffffff',
                    },
                }),
        },
        typography: {
            fontFamily: 'system-ui, sans-serif',
        },
    });
};