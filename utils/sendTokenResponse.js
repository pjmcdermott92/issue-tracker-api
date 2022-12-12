const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getToken();
    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 1000),
        httpOnly: false
    };
    if (process.env.NODE_ENV === 'production') options.secure = true;

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({ success: true, data: token });
};

module.exports = sendTokenResponse;
