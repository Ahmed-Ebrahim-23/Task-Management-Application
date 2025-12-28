const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['Authorization'] || req.headers['authorization'];
    if(!authHeader) {
        return res.json({
            status: 'fail',
            data: null,
            message: 'Authorization header missing'
        });
    }
    
    const token = authHeader.split(' ')[1];
    try {

        const currentUser = jwt.verify(token, process.env.JWT_SECRET);
        req.currentUser = currentUser.userId;
        next();

    } catch (err) {
        return res.status(401).json({
            status: 'fail',
            data: null,
            message: 'Invalid or expired token'
        });
    }   
    
}

module.exports = verifyToken;