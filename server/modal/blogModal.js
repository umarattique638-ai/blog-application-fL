import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      // type: String,
      // required: true,
      // trim: true,
    },
    catigory: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Category",
      // type: String,
      // required: true,
      // trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    featuredImgae: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
