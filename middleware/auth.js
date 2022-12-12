const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { errorResponse } = require('../middleware/errorHandler');
const asyncHandler = require('../middleware/asyncHandler');

const notAuthorizedErr = errorResponse('Not Authorized', 401);

exports.protectRoute = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) return next(notAuthorizedErr);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.user);
        next();
    } catch (err) {
        return next(notAuthorizedErr);
    }
});
