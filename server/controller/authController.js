import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../modal/userModal.js";
import Auth from "../modal/authModal.js";
import { errorHandlerHelper } from "../helper/errorHandlerHelper.js";
import userVerifyEmail from "../mail/userVerifyEmail.js";
import optVerifyEmail from "../mail/optVerifyEmail.js";
import cloudinary from "../config/cloudnary.js";

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, age, role } = req.body;

    if (!req.body || Object.keys(req.body).length === 0) {
      return next(errorHandlerHelper(400, "Request body is missing"));
    }

    if (!name || !email || !password || !age) {
      return next(errorHandlerHelper(400, "Please fill all the fields"));
    }

    if (isNaN(age)) {
      return next(errorHandlerHelper(400, "Age must be a number"));
    }

    if (!req.file || !req.file.path) {
      return next(errorHandlerHelper(400, "Please upload an image"));
    }

    const userImagePath = req.file.path;
    console.log("User Image Path", userImagePath);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(errorHandlerHelper(409, "User already registered"));
    }

    // Upload image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(userImagePath, {
      folder: "blogg-applications",
      resource_type: "auto",
    });

    if (!uploadResult || !uploadResult.secure_url) {
      return next(errorHandlerHelper(500, "Image upload failed"));
    }

    // Delete the local file after successful Cloudinary upload
    try {
      await fs.promises.unlink(userImagePath);
      console.log("Local file deleted after upload:", userImagePath);
    } catch (err) {
      console.error("Failed to delete local file:", err.message);
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Create user with uploaded image URL AND public_id
    const newUser = await User.create({
      name,
      email,
      role: role || "user",
      image: uploadResult.secure_url,
      imagePublicId: uploadResult.public_id, // ✅ ADDED THIS
      age,
      isVerified: false,
    });

    await Auth.create({
      user: newUser._id,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.SECRET_KEY,
      { expiresIn: "30m" }
    );

    // Send verification email
    userVerifyEmail(email, token);

    return res.status(201).json({
      status: true,
      message: "User Registered Successfully. Please Check Your Email.",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        age: newUser.age,
        image: newUser.image,
        isVerified: newUser.isVerified,
      },
    });
  } catch (error) {
    console.error(error);
    return next(errorHandlerHelper(500, error.message));
  }
};

export const loginUser = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(errorHandlerHelper(400, "Request body is missing"));
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return next(errorHandlerHelper(400, "Please fill all the fields"));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return next(errorHandlerHelper(409, "Authentication Failed"));
    }

    const auth = await Auth.findOne({ user: user._id });
    if (!auth) {
      return next(
        errorHandlerHelper(401, "Authentication Failed data not found")
      );
    }

    const hashPassword = await bcryptjs.compare(password, auth.password);
    if (!hashPassword) {
      return next(errorHandlerHelper(409, "Authentication Failed"));
    }
    if (!user.isVerified) {
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.SECRET_KEY,
        { expiresIn: "30m" }
      );

      // Send email for verification
      await userVerifyEmail(email, token);
      return next(
        errorHandlerHelper(409, "User is Not Verified yet  Again link send")
      );
    }

    const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "30m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id, email: user.email, type: "refresh" },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("user", user, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Update auth document
    auth.access_token = accessToken;
    auth.refresh_token = refreshToken;
    auth.isLoggedIn = true;
    await auth.save();

    return res.status(200).json({
      status: true,
      message: "User Loggin Successfully",
      user: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          age: user.age,
          role: user.role,
          image: user.image,
          isVerified: user.isVerified,
          accessToken,
          refreshToken,
        },
      },
    });
  } catch (error) {
    console.error(error);
    return next(errorHandlerHelper(500, error.message));
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return next(errorHandlerHelper(409, "Authentication Failed"));
    }

    const auth = await Auth.findOne({ user: user._id });
    if (!auth) {
      return next(
        errorHandlerHelper(401, "Authentication Failed - data not found")
      );
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

    // Update auth document to logout
    auth.access_token = null;
    auth.refresh_token = null;
    auth.isLoggedIn = false;
    await auth.save();

    return res.status(200).json({
      status: true,
      message: "User Logged Out Successfully",
    });
  } catch (error) {
    console.error(error);
    return next(errorHandlerHelper(500, error.message));
  }
};

export const verifyUserEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    if (!token) {
      return next(errorHandlerHelper(400, "Verification token is missing"));
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (err) {
      return next(
        errorHandlerHelper(400, "Invalid or expired verification token")
      );
    }

    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(errorHandlerHelper(404, "User not found"));
    }

    // Check if already verified
    if (user.isVerified) {
      return res.status(200).json({
        status: true,
        message: "User already verified",
      });
    }

    // Update user verification status
    user.isVerified = true;
    await user.save();

    return res.status(200).json({
      status: true,
      message: "Email verified successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    return next(errorHandlerHelper(500, error.message));
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(errorHandlerHelper(400, "Request body is missing"));
    }

    const { email } = req.body;

    if (!email) {
      return next(errorHandlerHelper(400, "Please fill the field"));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return next(errorHandlerHelper(409, "Authentication Failed"));
    }

    const auth = await Auth.findOne({ user: user._id });
    if (!auth) {
      return next(
        errorHandlerHelper(401, "Authentication Failed data not found")
      );
    }

    if (!user.isVerified) {
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.SECRET_KEY,
        { expiresIn: "30m" }
      );

      // Send email for verification
      await userVerifyEmail(email, token);
      return next(
        errorHandlerHelper(409, "User is Not Verified yet  Again link send")
      );
    }
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpired = new Date(Date.now() + 10 * 60 * 1000); // 10 minute
    const token = jwt.sign(
      { id: user._id, email: user.email, type: "reset" },
      process.env.SECRET_KEY,
      { expiresIn: "15m" }
    );

    res.cookie("otp", otp, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.cookie("email", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send OTP email
    await optVerifyEmail(email, token, otp, otpExpired);
    // Update auth document with OTP
    auth.otp = otp;
    auth.otpExpired = otpExpired;
    await auth.save();

    return res.status(200).json({
      status: true,
      message: "User Otp Send Successfully",
    });
  } catch (error) {
    console.error(error);
    return next(errorHandlerHelper(500, error.message));
  }
};

export const optVerification = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(errorHandlerHelper(400, "Request body is missing"));
    }

    const { otp } = req.body;
    const email = req.cookies?.email;
    if (!otp) {
      return next(errorHandlerHelper(400, "Please fill the field"));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return next(errorHandlerHelper(409, "Authentication Failed"));
    }

    const auth = await Auth.findOne({ user: user._id });
    if (!auth) {
      return next(
        errorHandlerHelper(401, "Authentication Failed data not found")
      );
    }

    // Check OTP
    if (auth.otp !== parseInt(otp)) {
      return next(errorHandlerHelper(400, "Invalid OTP."));
    }

    if (auth.otpExpired < new Date()) {
      return next(errorHandlerHelper(400, "OTP has expired."));
    }

    const resetToken = jwt.sign(
      { id: user._id, email: user.email, type: "confirmed_reset" },
      process.env.SECRET_KEY,
      { expiresIn: "15m" }
    );

    res.cookie("resetToken", resetToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      status: true,
      message: "OTP verified successfully. You can now reset your password.",
      token: resetToken,
    });
  } catch (error) {
    console.error(error);
    return next(errorHandlerHelper(500, error.message));
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(errorHandlerHelper(400, "Request body is missing"));
    }

    const { newPassword, confirmPassword } = req.body;

    const otp = req.cookies?.otp;
    const email = req.cookies?.email;
    const resetToken = req.cookies?.resetToken;
    if (!otp) {
      return next(errorHandlerHelper(400, "OTP is missing."));
    }
    if (!newPassword || !confirmPassword) {
      return next(errorHandlerHelper(400, "Please fill the field"));
    }

    if (newPassword !== confirmPassword) {
      return next(errorHandlerHelper(400, "Password Not Match"));
    }
    const user = await User.findOne({ email });
    if (!user) {
      return next(errorHandlerHelper(409, "Authentication Failed"));
    }

    const auth = await Auth.findOne({ user: user._id });
    if (!auth) {
      return next(
        errorHandlerHelper(401, "Authentication Failed data not found")
      );
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.SECRET_KEY);
    } catch (err) {
      return next(errorHandlerHelper(400, "Invalid or expired reset token."));
    }

    // Hash new password
    const hashedPassword = bcryptjs.hashSync(newPassword, 10);
    auth.password = hashedPassword;
    auth.otp = null;
    auth.otpExpired = null;
    auth.access_token = null;
    auth.refresh_token = null;
    auth.isLoggedIn = false;
    await auth.save();

    res.clearCookie("resetToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    res.clearCookie("otp", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    res.clearCookie("email", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    return res.status(200).json({
      status: true,
      message: "Password Updated Successfully",
    });
  } catch (error) {
    console.error(error);
    return next(errorHandlerHelper(500, error.message));
  }
};

export const googleLoginUser = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(errorHandlerHelper(400, "Request body is missing"));
    }

    const { email, avatar, name, age } = req.body;

    let user = await User.findOne({ email });

    const pass = "asdasd";
    const hashedPassword = bcryptjs.hashSync(pass, 10);
    if (!user) {
      const userAge = age || 21;
      const newUser = new User({
        name,
        email,
        age: userAge,
        image:
          typeof avatar === "string" && avatar.trim().length > 0
            ? avatar
            : "https://github.com/shadcn.png",
        isVerified: true,
      });
      user = await newUser.save();
    }
    console.log("avatar:", avatar);
    console.log("image set to:");

    let auth = await Auth.findOne({ user: user._id });
    if (!auth) {
      auth = new Auth({ user: user._id, password: hashedPassword });

      await auth.save();
    }

    const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "30m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id, email: user.email, type: "refresh" },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Store minimal user info or use JWT on client side instead of full user object
    res.cookie(
      "user",
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        role: user.role,
        image: user.image,
        isVerified: user.isVerified,
      },
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      }
    );

    // Update auth document
    auth.access_token = accessToken;
    auth.refresh_token = refreshToken;
    auth.isLoggedIn = true;
    await auth.save();

    return res.status(200).json({
      status: true,
      message: "User Logged In Successfully From Google",
      user: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          age: user.age,
          role: user.role,
          image: user.image,
          isVerified: user.isVerified,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error(error);
    return next(errorHandlerHelper(500, error.message));
  }
};
