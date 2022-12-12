if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const { errorHandler } = require('./middleware/errorHandler');
const connectDb = require('./config/connectDb');

connectDb();
const app = express();
app.server = http.createServer(app);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(xss());
app.use(hpp());
app.use(mongoSanitize());

app.get('/', (req, res) => res.send('Hello, World!'));
app.use('/api/v1', require('./routes'));

app.use(errorHandler);

if (process.env.NODE_ENV === 'test') module.exports = app;
else {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on Port ${PORT}...`));
}
