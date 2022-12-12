const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: [true, 'First name is required']
    },
    last_name: {
        type: String,
        required: [true, 'Last name is required']
    },
    display_name: {
        type: String,
        required: [true, 'Display name is required']
    },
    email: {
        type: String,
        required: [true, 'Email address is required'],
        unique: [true, 'Email address is already registered'],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Valid Email address is required'
        ]
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        select: false
    },
    avatar: String,
    role: {
        type: String,
        default: 'user'
    },
    permissions: [
        {
            type: String
        }
    ],
    passwordResetToken: String,
    passwordResetExpire: Date,
    accountLocked: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Hash password
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) next();
    this.password = await bcrypt.hash(this.password, 10);
});

// Verify user password
userSchema.methods.checkPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Issue JWT
userSchema.methods.getToken = function() {
    return jwt.sign({ user: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

// Issue password reset token
userSchema.methods.getPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    
    this.passwordResetExpire = Date.now() + (15 * 60 * 1000);
    return resetToken;
}

module.exports = mongoose.model('user', userSchema);
