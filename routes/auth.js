const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    forgotPassword,
    checkPasswordResetToken,
    resetPassword,
    logoutUser
} = require('../controllers/authControllers');

router.post('/', loginUser);
router.post('/register', registerUser);
router.post('/forgot-password', forgotPassword);
router.get('/reset-password/:token', checkPasswordResetToken);
router.put('/reset-password/:token', resetPassword);
router.get('/logout', logoutUser);

module.exports = router;
