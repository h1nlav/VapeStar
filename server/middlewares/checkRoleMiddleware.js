export default function (req, res, next) {
    if (req.method === 'OPTIONS') next();
    try {
        if (req.user.role !== 'ADMIN' && req.user.role !== 'ROOT') return res.json({ message: 'User not authorized' });
        next();
    } catch (err) {
        return res.json({ message: 'User not authorized' });
    }
}