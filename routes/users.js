const express = require('express');
const router = express.Router();
const { protectRoute } = require('../middleware/auth');
const {
    getMe,
    changePassword,
    getAllUsers,
    getUserById,
    editUserPermissions,
    userAccountLock,
    deleteUser,
    editMyAccount
} = require('../controllers/userControllers');

router.get('/', getAllUsers);

router.route('/me')
    .get(getMe)
    .put(editMyAccount)

router.put('/me/password', protectRoute, changePassword);

router.route('/:id')
    .get(getUserById)
    .put(editUserPermissions)
    .delete(deleteUser)

router.put('/:id/account-lock', userAccountLock);

module.exports = router;
