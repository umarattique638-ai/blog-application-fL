import { errorHandlerHelper } from "../helper/errorHandlerHelper.js";
import Category from "./../modal/categoryModal.js";

const addCategory = async (req, res, next) => {
  try {
    const { name, slug } = req.body;

    if (!req.body || Object.keys(req.body).length === 0) {
      return next(errorHandlerHelper(400, "Request body is missing"));
    }

    if (!name || !slug) {
      return next(errorHandlerHelper(400, "Please fill all the fields"));
    }

    // Normalize input
    const trimmedName = name.trim();
    const trimmedSlug = slug.trim().toLowerCase();

    // Check if name already exists
    const nameExists = await Category.findOne({ name: trimmedName });
    if (nameExists) {
      return next(errorHandlerHelper(409, "Category name already exists"));
    }

    // Check if slug already exists
    const slugExists = await Category.findOne({ slug: trimmedSlug });
    if (slugExists) {
      return next(errorHandlerHelper(409, "Category slug already exists"));
    }

    // Create new category
    const category = new Category({
      name: trimmedName,
      slug: trimmedSlug,
    });

    await category.save(); // You forgot to await

    return res.status(200).json({
      status: true,
      message: "Category Added Successfully",
      category,
    });
  } catch (error) {
    return next(errorHandlerHelper(500, error.message));
  }
};

import mongoose from "mongoose";

const showCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.id;

    // Optional: Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return next(errorHandlerHelper(400, "Invalid category ID"));
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return next(errorHandlerHelper(404, "Category not found"));
    }

    return res.status(200).json({
      status: true,
      message: "Category found",
      category,
    });
  } catch (error) {
    return next(errorHandlerHelper(500, error.message));
  }
};

const showAllCategory = async (req, res, next) => {
  try {
    // Fetch all categories
    const categories = await Category.find();

    return res.status(200).json({
      status: true,
      message: "Categories found",
      categories,
    });
  } catch (error) {
    return next(errorHandlerHelper(500, error.message));
  }
};

const delCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.id;

    // Optional: Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return next(errorHandlerHelper(400, "Invalid category ID"));
    }

    const category = await Category.findByIdAndDelete(categoryId);

    if (!category) {
      return next(errorHandlerHelper(404, "Category not found"));
    }

    return res.status(200).json({
      status: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Error in delCategory:", error);
    return next(errorHandlerHelper(500, error.message));
  }
};

const delAllCategory = async (req, res, next) => {
  try {
    if (!req.query.confirm || req.query.confirm !== "true") {
      return next(
        errorHandlerHelper(
          400,
          "Confirmation required to delete all categories"
        )
      );
    }

    const result = await Category.deleteMany({});

    return res.status(200).json({
      status: true,
      message: `${result.deletedCount} categories deleted successfully.`,
    });
  } catch (error) {
    return next(errorHandlerHelper(500, error.message));
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { name, slug } = req.body;
    const categoryId = req.params.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return next(errorHandlerHelper(400, "Invalid category ID"));
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return next(errorHandlerHelper(404, "Category not found"));
    }

    // Check for unique name
    if (name && name !== category.name) {
      const nameExists = await Category.findOne({ name });
      if (nameExists && nameExists._id.toString() !== categoryId) {
        return next(errorHandlerHelper(409, "Category name already exists"));
      }
    }

    // Check for unique slug
    if (slug && slug !== category.slug) {
      const slugExists = await Category.findOne({ slug });
      if (slugExists && slugExists._id.toString() !== categoryId) {
        return next(errorHandlerHelper(409, "Category slug already exists"));
      }
    }

    const updatedData = {};
    if (name) updatedData.name = name.trim();
    if (slug) updatedData.slug = slug.trim().toLowerCase();

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      updatedData,
      { new: true }
    );

    return res.status(200).json({
      status: true,
      message: "Category updated successfully",
      updatedCategory,
    });
  } catch (error) {
    console.error("Error in updateCategory:", error);
    return next(errorHandlerHelper(500, "Server Error: " + error.message));
  }
};

export {
  addCategory,
  showCategory,
  showAllCategory,
  delCategory,
  delAllCategory,
  updateCategory,
};
