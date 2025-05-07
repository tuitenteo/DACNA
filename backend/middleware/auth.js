const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Không có token' });

    const token = authHeader.split(' ')[1]; // "Bearer <token>"

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded; // Gắn thông tin user vào request
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Token không hợp lệ' });
    }
};

module.exports = verifyToken;
