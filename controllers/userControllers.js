const User = require('../models/User');
const { errorResponse } = require('../middleware/errorHandler');
const asyncHandler = require('../middleware/asyncHandler');
const checkUserPermitted = require('../utils/checkUserPermitted');

// @route   GET /users/me
// @desc    Get current logged in user
// @access  Private (Current User)
exports.getMe = (req, res) => res.json({
    success: true,
    data: req.user
});

// @route   GET /users
// @desc    Get all Users
// @access  Private (Permission only)
exports.getAllUsers = asyncHandler(async (req, res, next) => {
    if (!checkUserPermitted(req.user, ['usr-view-usr'])) {
        return next(errorResponse('Insufficient Permissions', 403));
    };

    const users = await User.find({});
    res.json({ success: true, data: users });
});

// @route   GET /users/:id
// @desc    Get a user by ID
// @access  Private (Permission only)
exports.getUserById = asyncHandler(async (req, res, next) => {
    if (!checkUserPermitted(req.user, ['usr-view-usr'])) {
        return next(errorResponse('Insufficient Permissions', 403));
    };

    const user = await User.findById(req.params.id);
    if (!user) return next(errorResponse('No user with that ID was found', 400));

    res.json({ success: true, data: user });
});

// @route   PUT /users/:id
// @desc    Edit a user's permissions by ID
// @access  Private (Permission only)
exports.editUserPermissions = asyncHandler(async (req, res, next) => {
    if (!checkUserPermitted(req.user, ['usr-assign-access'])) {
        return next(errorResponse('Insufficient Permissions', 403));
    };

    const { role, permissions } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return next(errorResponse('No user with that ID was found', 400));
    if (user._id.toString() === req.user._id.toString()) {
        return next(errorResponse('You cannot edit your own Permissions', 400));
    };

    user.permissions = permissions;
    user.role = role;
    await user.save();

    res.json({ success: true, data: user });
});

// @route   PUT /users/:id/account-lock
// @desc    Lock/Unlock a user's account
// @access  Private (Permission only)
exports.userAccountLock = asyncHandler(async (req, res, next) => {
    if (!checkUserPermitted(req.user, ['usr-lock-users'])) {
        return next(errorResponse('Insufficient Permissions', 403));
    };

    const user = await User.findById(req.params.id);
    if (!user) return next(errorResponse('No user with that ID was found', 400));
    if (user._id.toString() === req.user._id.toString()) {
        return next(errorResponse('You cannot lock your own account', 400));
    };

    if (user.accountLocked) {
        user.accountLocked = false;
    } else {
        user.accountLocked = true;
    };
    
    await user.save();
    res.json({ success: true, data: user });
});

// @route   DEL /users/:id
// @desc    Delete a user's account
// @access  Private (Permission only)
exports.deleteUser = asyncHandler(async (req, res, next) => {
    if (!checkUserPermitted(req.user, ['usr-delete-users'])) {
        return next(errorResponse('Insufficient Permissions', 403));
    };

    const user = await User.findById(req.params.id);
    if (!user) return next(errorResponse('No user with that ID was found', 400));
    if (user._id.toString() === req.user._id.toString()) {
        return next(errorResponse('You cannot delete your own account', 400));
    };

    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

// @route   PUT /users/me
// @desc    Edit current user info
// @access  Private (Current User)
exports.editMyAccount = asyncHandler(async (req, res, next) => {
    const { first_name, last_name, display_name, phone } = req.body;
    if (!first_name || !last_name || !display_name) {
        return next(errorResponse('Some required information is missing', 400));
    }

    const user = await User.findById(req.user._id);
    if (!user) return next(errorResponse('User not found', 404));

    user.first_name = first_name;
    user.last_name = last_name;
    user.display_name = display_name;
    await user.save();

    res.json({ success: true, data: user });
});

// @route   PUT /users/me/avatar
// @desc    Upload a new avatar (profile) image
// @access  Private (Current User)
    //@TODO: Upload the new image to S3;
    //@TODO: Check if the user currently has an image; if so, delete it from S3;
    //@TODO: Update the DB with the new profile image url;
    //@TODO: Return the new User object to update the UI context


// @route   PUT /users/me/password
// @desc    Change current user password
// @access  Private (Current User)
exports.changePassword = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id).select('+password');
    if (!user) return next(errorResponse('User not found', 404));

    const { current_password, new_password } = req.body;

    const verifyCurrentPassword = await user.checkPassword(current_password);
    if (!verifyCurrentPassword) return next(errorResponse('Current password is incorrect.', 400));

    const checkUniquePassword = await user.checkPassword(new_password);
    if (checkUniquePassword) return next(errorResponse('New password cannot be the same as current password.', 400));

    user.password = new_password;
    await user.save();

    res.json({ success: true, data: 'Password updated' });
});
