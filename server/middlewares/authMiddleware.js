import jwt from 'jsonwebtoken';

export default function (req, res, next) {
    if (req.method === 'OPTIONS') next();
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (token === 'null') return res.status(200).json({});
        req.user = jwt.verify(token, process.env.JWT_KEY);
        if (!req.user || !req.user.id) return res.json({ message: 'User not authorized' });
        next();
    } catch (err) {
        res.json({ message: 'User not authorized' });
    }
}