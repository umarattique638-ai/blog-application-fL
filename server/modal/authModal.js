import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
    trim: true,
  },
  isLoggedIn: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: Number,
    default: null,
  },
  otpExpired: {
    type: Date,
    default: null,
  },
  access_token: {
    type: String,
    default: null,
  },
  refresh_token: {
    type: String,
    default: null,
  },
});

const Auth = mongoose.model("Auth", authSchema);
export default Auth;
