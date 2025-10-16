import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import Auth from "../modal/authModal.js";
import { errorHandlerHelper } from "../helper/errorHandlerHelper.js";
import User from "../modal/userModal.js";

// Fix for __dirname in ES moduless
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Show Single user profile
const showUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return next(errorHandlerHelper(409, "User not Founded"));
    }
    if (req.user.id !== userId) {
      return errorHandlerHelper(
        403,
        "You are not authorized to access this user"
      );
    }
    // Respond with user data
    return res.status(200).json({
      status: true,
      message: "User Found",
      userId: user._id,
      userName: user.name,
      userEmail: user.email,
      userImg: user.image,
      userVerification: user.isVerified,
    });
  } catch (error) {
    return next(errorHandlerHelper(500, "Internal Server Error"));
  }
};

const showallusers = async (req, res, next) => {
  try {
    // Fetch all users, exclude passwords
    const users = await User.find();

    // Check if users exist
    if (!users || users.length === 0) {
      return next(handleError(404, "Users Not Found"));
    }

    // Return all users
    return res.status(200).json({
      status: true,
      message: "Users Found",
      data: users,
    });
  } catch (error) {
    return next(handleError(500, "Server Error"));
  }
};

const delUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Fetch user by ID
    const user = await User.findById(userId);

    // Check if user exists
    if (!user) {
      return next(errorHandlerHelper(404, "User Not Found"));
    }

    // Authorization: Only the user or an admin can delete
    if (req.user.id !== userId && req.user.role !== "admin") {
      return next(
        errorHandlerHelper(403, "You are not authorized to delete this user")
      );
    }

    // Delete associated auth and session data
    await Auth.deleteMany({ user: userId });

    // Delete user's image from the server (if it exists)
    if (user.image) {
      const imagePath = path.join(__dirname, "..", "uploads", user.image);
      try {
        await fs.promises.access(imagePath, fs.constants.F_OK); // Check if file exists
        await fs.promises.unlink(imagePath); // Delete file
        console.log("Image deleted successfully:", imagePath);
      } catch (err) {
        console.error(`Error deleting image at ${imagePath}:`, err);
      }
    }

    // Delete user from DB
    await user.deleteOne();
    // Clear cookie
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });
    res.clearCookie("user", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    return res.status(200).json({
      status: true,
      message: "User Deleted Successfully",
    });
  } catch (error) {
    console.error("Error in delUser:", error);
    return next(errorHandlerHelperr(500, "Server Error"));
  }
};

const delAllusers = async (req, res, next) => {
  try {
    // Fetch all users
    const users = await User.find();

    // Check if there are users
    if (!users || users.length === 0) {
      return next(errorHandlerHelper(404, "Users Not Found"));
    }

    // Loop through all users and perform cleanup
    for (const user of users) {
      // Delete user's image if it exists
      if (user.image) {
        const imagePath = path.join(__dirname, "..", "uploads", user.image);
        try {
          await fs.promises.access(imagePath, fs.constants.F_OK);
          await fs.promises.unlink(imagePath);
          console.log("Image deleted successfully:", imagePath);
        } catch (err) {
          console.error(`Error deleting image at ${imagePath}:`, err);
        }
      }

      // Delete associated session and auth records
      await Auth.deleteMany({ user: user._id });

      // Delete the user
      await User.deleteMany({ _id: user._id });
    }
    // Clear cookie
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });
    res.clearCookie("user", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });
    return res.status(200).json({
      status: true,
      message: "All Users Deleted Successfully",
    });
  } catch (error) {
    console.error("Error in delAll:", error);
    return next(errorHandlerHelper(500, "Server Error"));
  }
};

const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { name, email, age } = req.body;
    const newImage = req.file?.filename; // Get new uploaded image (if any)

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return next(errorHandlerHelper(404, "User Not Found"));
    }

    // Authorization: Only user or admin can update
    if (!req.user || (req.user.id !== userId && req.user.role !== "admin")) {
      return next(
        errorHandlerHelper(403, "You are not authorized to update this user")
      );
    }

    // Prepare fields for update
    const updatedData = {};
    if (name) updatedData.name = name;
    if (age) updatedData.age = age;
    if (email) updatedData.email = email;
    if (newImage) updatedData.image = newImage;

    // Delete old image if a new one is uploaded
    if (newImage && user.image && user.image !== newImage) {
      const oldImagePath = path.join(__dirname, "..", "uploads", user.image);
      try {
        await fs.promises.access(oldImagePath, fs.constants.F_OK);
        await fs.promises.unlink(oldImagePath);
        console.log("Old image deleted:", oldImagePath);
      } catch (err) {
        console.error("Error deleting old image:", err.message);
      }
    }

    // Update user in DB
    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true, // Return updated document
    });

    return res.status(200).json({
      status: true,
      message: "User Updated Successfully",
      updatedUser,
    });
  } catch (error) {
    console.error("Error in updateUser:", error);
    return next(errorHandlerHelper(500, "Server Error"));
  }
};

export { showUser, showallusers, delUser, updateUser, delAllusers };
