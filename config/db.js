const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables

const MONGO_URL = process.env.MONGODB_URL ; // Ensure you are using the correct key

if (!MONGO_URL) {
    throw new Error("❌ MongoDB URI is missing. Check your .env file.");
}

const connectDb = async () => {
    try {
        await mongoose.connect(MONGO_URL); // No need for deprecated options
        console.log("✅ Database connected successfully.");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
        process.exit(1);
    }
};

module.exports = connectDb;
