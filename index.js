import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";
import authRoute from "./routes/auth.js";
import AdvertRoute from "./routes/advert.js";
import userRoute from "./routes/users.js";
import PaymentRequestRoute from "./routes/PaymentRequest.js";
import ContactRoute from "./routes/Contact.js";
import { errorHandler } from "./errorHandler.js";
import bodyParser from "body-parser";


// Load environment variables
dotenv.config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Initialize Express app
const app = express();
const port = process.env.PORT || 8000;

// CORS options
const corsOptions = {
  origin: true,
  credentials: true,
};

// Database connection function
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
  }
};

// Middleware setup
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Error handling middleware
app.use(errorHandler);

// Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/adverts", AdvertRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/payment", PaymentRequestRoute);
app.use("/api/v1/contact", ContactRoute);

// Start server
app.listen(port, () => {
  connectDB(); // Connect to database on server start
  console.log(`Server running on port ${port}`);
});
