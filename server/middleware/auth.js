import jwt from 'jsonwebtoken';
import Users from '../models/userSchema.js';

export const protect = async (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await Users.findOne({ email: decoded.email });
            next();
        } catch (err) {
            return res.status(401).json({ message: 'Authentication failed' });
        }
    }
    else {
        return res.status(401).json({ message: 'Authentication failed' });
    }
};
