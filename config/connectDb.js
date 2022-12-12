const mongoose = require('mongoose');

const connectDb = async () => {
    if (process.env.NODE_ENV === 'test') {
        // @TODO: Set up Testing DB
    } else {
        try {
            const conn = await mongoose.connect(process.env.MONGO_URI);
            console.log(`MongoDB database connected: ${conn.connection.host}`);
        } catch (err) {
            console.error(err);
            process.exit(1);
        }
    }
}

module.exports = connectDb;
