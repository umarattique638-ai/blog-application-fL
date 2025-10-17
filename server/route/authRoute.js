import express from "express";
import {
  forgotPassword,
  loginUser,
  logoutUser,
  registerUser,
  verifyUserEmail,
  optVerification,
  resetPassword,
  googleLoginUser,
} from "../controller/authController.js";

import upload from "../config/multer.js";
import checkToken from "../middleware/checkToken.js";

const authRoute = express.Router();

authRoute.post("/register", upload.single("image"), registerUser);
authRoute.post("/login", loginUser);
authRoute.post("/logout", checkToken, logoutUser);
authRoute.get("/confirm-verification/:token", verifyUserEmail);
authRoute.post("/forgot-password", forgotPassword);
authRoute.post("/otp-verification", optVerification);
authRoute.post("/reset-password", resetPassword);
authRoute.post("/google-login", googleLoginUser);
export default authRoute;
