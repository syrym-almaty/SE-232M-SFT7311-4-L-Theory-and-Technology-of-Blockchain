// backend/db/db.js
const mongoose = require('mongoose');
const config = require('../config/config');

const connectDB = async () => {
    try {
        await mongoose.connect(config.dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection error:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
