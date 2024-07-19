import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "cloudinary";
// User registration controllers
export const register = async (req, res) => {
  try {
    const { username, email, password, phone, photo } = req.body;

    let newUser;

    if (photo) {
      // Usage of cloudinary to upload avatar
      let myCloud;
      try {
        myCloud = await cloudinary.v2.uploader.upload(photo, {
          folder: "avatars",
        });
      } catch (error) {
        console.error("Cloudinary upload error:", error);
        return res.status(500).json({
          success: false,
          message: "Error uploading avatar",
        });
      }

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      newUser = new User({
        username,
        email,
        phone,
        password: hash,
        photo: {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        },
      });
    } else {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      newUser = new User({
        username,
        email,
        phone,
        password: hash,
      });
    }

    await newUser.save();
    res.status(200).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (err) {
    console.error("User registration error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create a user, try again",
    });
  }
};
// User authentication controllers
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    const checkCorrectPassword = await bcrypt.compare(password, user.password);
    if (!checkCorrectPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const { password: userPassword, role, ...rest } = user._doc;

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "15d" }
    );

    // Set token into the browser as cookies
    res
      .cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days in milliseconds
      })
      .status(200)
      .json({
        token,
        data: { ...rest },
        role,
      });
  } catch (err) {
    res.status(401).json({
      success: false,
      message: "Login failed",
    });
  }
};

// Controller to get user profile
export const getProfile = async (req, res) => {
  try {
    // Fetch user profile based on the user ID from the token
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    console.error("Failed to retrieve user profile:", err);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve user profile",
    });
  }
};
