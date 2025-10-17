import express from "express";
import checkToken from "../middleware/checkToken.js";
import {
  showUser,
  showallusers,
  delUser,
  updateUser,
  delAllusers,
} from "../controller/userController.js";
import upload from "../config/multer.js";

const userRoute = express.Router();
userRoute.get("/showuser/:id", checkToken, showUser);
userRoute.get("/showalluser", checkToken, showallusers);
userRoute.delete("/delalluser", checkToken, delAllusers);
userRoute.delete("/deleteuser/:id", checkToken, delUser);
userRoute.put(
  "/updateuser/:id",
  upload.single("image"),
  checkToken,
  updateUser
);
export default userRoute;
