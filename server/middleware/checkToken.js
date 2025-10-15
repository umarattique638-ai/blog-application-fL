import jwt from "jsonwebtoken";
import { errorHandlerHelper } from "../helper/errorHandlerHelper.js";
import User from "../modal/userModal.js";
import Auth from "../modal/authModal.js";

const checkToken = async (req, res, next) => {
  try {
    const token = req.cookies?.access_token; // note 'cookies' plural
    if (!token) {
      return next(errorHandlerHelper(403, "Unauthorized - Token Not Found"));
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const user = await User.findById(decoded.id);
    if (!user) {
      return next(errorHandlerHelper(403, "Unauthorized - User not found"));
    }
    // ✅ Get Auth Document
    const auth = await Auth.findOne({ user: user._id });
    if (!auth || !auth.isLoggedIn) {
      return next(errorHandlerHelper(403, "User is not logged in"));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(
      errorHandlerHelper(401, "Unauthorized - Invalid or expired token")
    );
  }
};

export default checkToken;
