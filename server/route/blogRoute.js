import express from "express";
import checkToken from "../middleware/checkToken.js";
import upload from "../config/multer.js";
import {
  addBlog,
  deleteallBlog,
  deleteBlog,
  showallBlog,
  showBlog,
  updateBlog,
} from "../controller/blogController.js";

const blogRoute = express.Router();

blogRoute.post(
  "/add-blog",
  upload.single("featuredImgae"),
  checkToken,
  addBlog
);
blogRoute.get("/show-blog/:id", checkToken, showBlog);
blogRoute.get("/showall-blog", checkToken, showallBlog);
blogRoute.delete("/deleteall-blog", checkToken, deleteallBlog);
blogRoute.delete("/delete-blog/:id", checkToken, deleteBlog);
blogRoute.put(
  "/update-blog/:id",
  upload.single("featuredImgae"),
  checkToken,
  updateBlog
);
export default blogRoute;
