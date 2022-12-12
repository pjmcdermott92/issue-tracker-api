const crypto = require('crypto');
const User = require('../models/User');
const { errorResponse } = require('../middleware/errorHandler');
const asyncHandler = require('../middleware/asyncHandler');
const sendTokenResponse = require('../utils/sendTokenResponse');
const sendMail = require('../utils/sendMail');
const { DEFAULT_ROLES } = require('../data/roles-permissions');

// @route   POST /api/v1/auth/register
// @desc    Register a new user
// @access  Public
exports.registerUser = asyncHandler(async (req, res, next) => {
    const {
        first_name,
        last_name,
        email,
        password,
        role
    } = req.body;

    if (!first_name || !last_name || !email || !password) {
        return next(errorResponse('Please provide all required information'));
    }

    const getUserPermissions = () => {
        const userRole = DEFAULT_ROLES[role] || null;
        if (!userRole) return [];
        return userRole.default_permissions;
    }

    const user = await User.create({
        first_name,
        last_name,
        display_name: `${first_name} ${last_name}`,
        email: email.toLowerCase(),
        password,
        role,
        permissions: getUserPermissions()
    });

    sendTokenResponse(user, 201, res);
});

// @route   POST /api/v1/auth
// @desc    Login a user
// @access  Public
exports.loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(errorResponse('Please provide an email address and password', 400));
    };

    const invalidCredentialRes = errorResponse('Invalid credentials', 401);
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) return next(invalidCredentialRes);

    const isValidPassword = await user.checkPassword(password);
    if (!isValidPassword) return next(invalidCredentialRes);

    if (user.accountLocked) {
        return next(errorResponse('Your account has been locked by your Administrator.', 401));
    }

    sendTokenResponse(user, 200, res);
});

// @route   POST /api/v1/auth/forgot-password
// @desc    Create password reset token and send email
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    if (!email) return next(errorResponse('Email address is required'));

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.json({ success: true });

    const resetToken = user.getPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL}/login/reset-password?token=${resetToken}`;
    const message = `
    You have received this message because your (or someone else) has requested a password reset for your account.

    If you did not make this request, please disregard this email. It is possible that someone else entered your email by mistake.

    If you did make this request, follow the link below to reset your password:

    ${resetUrl}

    NOTE: This link will expire in 15 minutes.
    `;

    const options = {
        email: user.email,
        subject: 'Password Reset Request',
        message
    };

    try {
        await sendMail(options);
        res.status(200).json({ success: true, data: 'Message sent' });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(errorResponse('Error sending email', 500));
    };
});

// @route   GET /api/v1/auth/reset-password/:token
// @desc    Verify Password Reset Token & Reset Password
// @access  Public (with valid token)
exports.checkPasswordResetToken = asyncHandler(async (req, res, next) => {
    const passwordResetToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        passwordResetToken,
        passwordResetExpire: { $gt: Date.now() }
    });

    if (!user) return next(errorResponse('Reset Token Invalid or Expired.', 400));
    res.json({ success: true });
});

// @route   PUT /api/v1/auth/reset-password/:token
// @desc    Verify Password Reset Token & Reset Password
// @access  Public (with valid token)
exports.resetPassword = asyncHandler(async (req, res, next) => {
    const passwordResetToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');
    
    const user = await User.findOne({
        passwordResetToken,
        passwordResetExpire: { $gt: Date.now() }
    });

    if (!user) return next(errorResponse('Invalid Token', 400));
    
    if (req.body.password?.length > 0) {
        user.password = req.body.password;
        user.passwordResetToken = undefined;
        user.passwordResetExpire = undefined;
        await user.save();
    }

    res.json({ success: true });
});

// @route   GET /api/v1/auth/logout
// @desc    Log user out
// @access  Public
exports.logoutUser = asyncHandler(async (req, res, next) => {
    res.cookie('token', 'none', {
        expiresIn: new Date(Date.now() + 1 * 1000),
        httpOnly: true
    });
    res.status(200).json({ success: true, data: {} });
});
