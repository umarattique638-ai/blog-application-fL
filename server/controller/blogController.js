import { errorHandlerHelper } from "../helper/errorHandlerHelper.js";
import Blog from "../modal/blogModal.js";
import cloudinary from "../config/cloudnary.js";
import fs from "fs";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import { encode } from "entities";
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

const addBlog = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(errorHandlerHelper(400, "Request body is missing"));
    }
    const { title, slug, content, author, catigory } = req.body;
    if (!title || !slug || !content || !author || !catigory) {
      return next(errorHandlerHelper(400, "Please fill all the fields"));
    }
    if (!req.file || !req.file.path) {
      return next(errorHandlerHelper(400, "Please upload an image"));
    }
    const localImagePath = req.file.path;
    const uploadResult = await cloudinary.uploader.upload(localImagePath, {
      folder: "blogg-applications",
      resource_type: "auto",
    });
    if (!uploadResult || !uploadResult.secure_url) {
      return next(errorHandlerHelper(500, "Image upload failed"));
    }
    try {
      await fs.promises.unlink(localImagePath);
      console.log("Local file deleted after upload:", localImagePath);
    } catch (err) {
      console.error("Failed to delete local file:", err.message);
    }
    const blog = new Blog({
      catigory,
      author,
      title: title,
      slug: slug,
      content: encode(content),
      featuredImgae: uploadResult.secure_url,
    });
    await blog.save();
    return res.status(200).json({
      status: true,
      message: "Blog Added Successfully",
      blog: blog,
    });
  } catch (error) {
    return next(errorHandlerHelper(500, error.message));
  }
};

const showBlog = async (req, res, next) => {
  try {
    const blogId = req.params.id;
    // Optional: Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return next(errorHandlerHelper(400, "Invalid Blog ID"));
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return next(errorHandlerHelper(404, "Blog Not Founded"));
    }
    return res.status(200).json({
      status: true,
      message: "Blog Founded",
      blog: blog,
    });
  } catch (error) {
    return next(errorHandlerHelper(500, error.message));
  }
};

const showallBlog = async (req, res, next) => {
  try {
    const blog = await Blog.find();
    if (!blog) {
      return next(errorHandlerHelper(404, "Blog Not Founded"));
    }
    return res.status(200).json({
      status: true,
      message: "Blog Founded",
      blog: blog,
    });
  } catch (error) {
    return next(errorHandlerHelper(500, error.message));
  }
};
const deleteBlog = async (req, res, next) => {
  try {
    const blogId = req.params.id;
    // Optional: Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return next(errorHandlerHelper(400, "Invalid Blog ID"));
    }
    if (!req.query.confirm || req.query.confirm !== "true") {
      return next(
        errorHandlerHelper(400, "Confirmation required to delete This Blog")
      );
    }

    const blog = await Blog.findByIdAndDelete(blogId);
    if (!blog) {
      return next(errorHandlerHelper(404, "Blog Not Founded"));
    }
    // Delete image from Cloudinary
    if (blog.featuredImgae) {
      console.log("Deleting image from Cloudinary...");
      await deleteImageFromCloudinary(blog.imagePublicId, blog.featuredImgae);
    }
    return res.status(200).json({
      status: true,
      message: "Blog Deleted Successfully",
    });
  } catch (error) {
    return next(errorHandlerHelper(500, error.message));
  }
};

const deleteallBlog = async (req, res, next) => {
  try {
    const blogs = await Blog.find();
    if (!req.query.confirm || req.query.confirm !== "true") {
      return next(
        errorHandlerHelper(400, "Confirmation required to delete This Blog")
      );
    }
    // Delete all blog images from Cloudinary
    for (const blog of blogs) {
      if (blog.imagePublicId || blog.featuredImgae) {
        await deleteImageFromCloudinary(blog.imagePublicId, blog.featuredImgae);
      }
    }

    // Delete all blog entries from the database
    const result = await Blog.deleteMany({});

    return res.status(200).json({
      status: true,
      message: `${result.deletedCount} Blogs deleted successfully.`,
    });
  } catch (error) {
    return next(errorHandlerHelper(500, error.message));
  }
};

const updateBlog = async (req, res, next) => {
  try {
    const { title, slug, content, author, catigory } = req.body;
    const blogId = req.params.id;
    const imageFile = req.file;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return next(errorHandlerHelper(400, "Invalid Blog ID"));
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return next(errorHandlerHelper(404, "Blog not found"));
    }

    const updatedData = {};
    if (title) updatedData.title = title.trim();
    if (slug) updatedData.slug = slug.trim().toLowerCase();
    if (catigory) updatedData.catigory = catigory.trim();
    if (author) updatedData.author = author.trim();
    if (content) updatedData.content = content.trim();

    // === Handle Image Upload ===
    if (imageFile) {
      try {
        // Delete previous image from Cloudinary
        if (blog.imagePublicId || blog.featuredImgae) {
          await deleteImageFromCloudinary(
            blog.imagePublicId,
            blog.featuredImgae
          );
        }

        // Upload new image to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(imageFile.path, {
          folder: "blogg-applications",
        });

        // Delete local file after successful upload
        try {
          await fs.promises.unlink(imageFile.path);
          console.log("✅ New local file deleted:", imageFile.path);
        } catch (err) {
          console.error("❌ Failed to delete new local file:", err.message);
        }

        // Clean uploads folder
        console.log("Cleaning uploads folder...");
        await cleanUploadsFolder();

        // Update blog data with image
        updatedData.featuredImgae = uploadResult.secure_url;
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

    // === Update Blog in DB ===
    const updatedBlog = await Blog.findByIdAndUpdate(blogId, updatedData, {
      new: true,
    });

    return res.status(200).json({
      status: true,
      message: "Blog updated successfully",
      blog: updatedBlog,
    });
  } catch (error) {
    console.error("Error in updateBlog:", error);
    return next(errorHandlerHelper(500, "Server Error: " + error.message));
  }
};

export {
  addBlog,
  showBlog,
  showallBlog,
  deleteBlog,
  deleteallBlog,
  updateBlog,
};
