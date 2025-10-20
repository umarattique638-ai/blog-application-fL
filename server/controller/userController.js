import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import Auth from "../modal/authModal.js";
import { errorHandlerHelper } from "../helper/errorHandlerHelper.js";
import User from "../modal/userModal.js";
import cloudinary from "../config/cloudnary.js";

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to delete image from Cloudinary
const deleteImageFromCloudinary = async (imagePublicId, imageUrl) => {
  try {
    // If we have the public_id, use it directly
    if (imagePublicId) {
      const deleteResult = await cloudinary.uploader.destroy(imagePublicId);
      console.log("✅ Cloudinary image deleted:", imagePublicId, deleteResult);
      return deleteResult;
    }

    // If no public_id but we have a Cloudinary URL, extract it
    if (imageUrl && imageUrl.includes("cloudinary")) {
      const urlParts = imageUrl.split("/");
      const folderIndex = urlParts.indexOf("blogg-applications");
      if (folderIndex !== -1) {
        const filename = urlParts[folderIndex + 1].split(".")[0];
        const extractedPublicId = `blogg-applications/${filename}`;
        const deleteResult = await cloudinary.uploader.destroy(
          extractedPublicId
        );
        console.log(
          "✅ Cloudinary image deleted (extracted):",
          extractedPublicId,
          deleteResult
        );
        return deleteResult;
      }
    }
  } catch (err) {
    console.error("❌ Failed to delete from Cloudinary:", err.message);
  }
};

// Helper function to delete all files from uploads folder
const cleanUploadsFolder = async () => {
  try {
    const uploadsDir = path.join(__dirname, "..", "uploads");
    const files = await fs.promises.readdir(uploadsDir);

    for (const file of files) {
      // Skip .gitkeep and system files
      if (file !== ".gitkeep" && file !== ".DS_Store") {
        const filePath = path.join(uploadsDir, file);
        try {
          await fs.promises.unlink(filePath);
          console.log("✅ Deleted file from uploads:", file);
        } catch (unlinkErr) {
          console.error("Failed to delete file:", file, unlinkErr.message);
        }
      }
    }
  } catch (err) {
    console.error("Could not clean uploads directory:", err.message);
  }
};

// Show Single user profile
const showUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return next(errorHandlerHelper(404, "User not Found"));
    }
    if (req.user.id !== userId) {
      return next(
        errorHandlerHelper(403, "You are not authorized to access this user")
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
      return next(errorHandlerHelper(404, "Users Not Found"));
    }

    // Return all users
    return res.status(200).json({
      status: true,
      message: "Users Found",
      data: users,
    });
  } catch (error) {
    return next(errorHandlerHelper(500, "Server Error"));
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

    console.log("=== USER DELETION PROCESS STARTED ===");
    console.log("Deleting user:", user.email);

    // Delete image from Cloudinary
    if (user.image) {
      console.log("Deleting image from Cloudinary...");
      await deleteImageFromCloudinary(user.imagePublicId, user.image);
    }

    // Delete associated auth data
    await Auth.deleteMany({ user: userId });
    console.log("✅ Auth records deleted");

    // Delete user from DB
    await user.deleteOne();
    console.log("✅ User deleted from database");

    // Clean uploads folder
    console.log("Cleaning uploads folder...");
    await cleanUploadsFolder();

    // Clear cookies
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

    console.log("=== USER DELETION PROCESS COMPLETED ===");

    return res.status(200).json({
      status: true,
      message: "User Deleted Successfully",
    });
  } catch (error) {
    console.error("Error in delUser:", error);
    return next(errorHandlerHelper(500, "Server Error"));
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

    console.log("=== DELETE ALL USERS PROCESS STARTED ===");
    console.log(`Deleting ${users.length} users...`);

    // Loop through all users and perform cleanup
    for (const user of users) {
      console.log(`Processing user: ${user.email}`);

      // Delete user's image from Cloudinary
      if (user.image) {
        await deleteImageFromCloudinary(user.imagePublicId, user.image);
      }

      // Delete associated auth records
      await Auth.deleteMany({ user: user._id });
    }

    // Delete all users from database
    await User.deleteMany({});
    console.log("✅ All users deleted from database");

    // Clean entire uploads folder
    console.log("Cleaning uploads folder...");
    await cleanUploadsFolder();

    // Clear cookies
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

    console.log("=== DELETE ALL USERS PROCESS COMPLETED ===");

    return res.status(200).json({
      status: true,
      message: "All Users Deleted Successfully",
    });
  } catch (error) {
    console.error("Error in delAllusers:", error);
    return next(errorHandlerHelper(500, "Server Error"));
  }
};

const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { name, email, age } = req.body;
    const imageFile = req.file;

    const user = await User.findById(userId);
    if (!user) {
      return next(errorHandlerHelper(404, "User Not Found"));
    }

    // Authorization check
    if (!req.user || (req.user.id !== userId && req.user.role !== "admin")) {
      return next(
        errorHandlerHelper(403, "You are not authorized to update this user")
      );
    }

    const updatedData = {};
    if (name) updatedData.name = name;
    if (age) updatedData.age = age;
    if (email) updatedData.email = email;

    // Handle new image upload
    if (imageFile && imageFile.path) {
      try {
        console.log("=== IMAGE UPDATE PROCESS STARTED ===");
        console.log("New image file path:", imageFile.path);
        console.log("Current user image:", user.image);
        console.log("Current user imagePublicId:", user.imagePublicId);

        // 1. Upload new image to Cloudinary FIRST
        const uploadResult = await cloudinary.uploader.upload(imageFile.path, {
          folder: "blogg-applications",
          resource_type: "image",
        });

        if (!uploadResult || !uploadResult.secure_url) {
          return next(errorHandlerHelper(500, "Image upload failed"));
        }

        console.log(
          "New image uploaded to Cloudinary:",
          uploadResult.secure_url
        );
        console.log("New image public_id:", uploadResult.public_id);

        // 2. Delete old image from Cloudinary
        if (user.image) {
          console.log("Deleting old image from Cloudinary...");
          await deleteImageFromCloudinary(user.imagePublicId, user.image);
        }

        // 3. Delete the NEWLY uploaded local file (the one multer just created)
        console.log("Deleting newly uploaded local file...");
        try {
          await fs.promises.unlink(imageFile.path);
          console.log("✅ New local file deleted:", imageFile.path);
        } catch (err) {
          console.error("❌ Failed to delete new local file:", err.message);
        }

        // 4. Clean uploads folder
        console.log("Cleaning uploads folder...");
        await cleanUploadsFolder();

        // 5. Update user data with new image info
        updatedData.image = uploadResult.secure_url;
        updatedData.imagePublicId = uploadResult.public_id;

        console.log("=== IMAGE UPDATE PROCESS COMPLETED ===");
      } catch (uploadError) {
        console.error("❌ Error during image upload process:", uploadError);

        // Clean up the uploaded file if something went wrong
        if (imageFile && imageFile.path) {
          try {
            await fs.promises.unlink(imageFile.path);
            console.log("Cleaned up failed upload file");
          } catch (cleanupErr) {
            console.error("Failed to cleanup file:", cleanupErr);
          }
        }

        return next(
          errorHandlerHelper(500, "Image update failed: " + uploadError.message)
        );
      }
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });

    return res.status(200).json({
      status: true,
      message: "User Updated Successfully",
      updatedUser,
    });
  } catch (error) {
    console.error("Error in updateUser:", error);
    return next(errorHandlerHelper(500, "Server Error: " + error.message));
  }
};

export { showUser, showallusers, delUser, updateUser, delAllusers };
