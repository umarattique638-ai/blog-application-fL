import axios from "axios";

// Directly access Vite env variables
const baseAuthURL = import.meta.env.VITE_BASE_API_BACKEND_AUTH_URL;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const registerUser = async (formData) => {
  try {
    const response = await axios.post(`${baseAuthURL}/register`, formData);
    await sleep(1000); // ⏳ Add delay
    return response.data;
  } catch (error) {
    throw error;
  }
};

const verificationUser = async (token) => {
  try {
    const response = await axios.get(
      `${baseAuthURL}/confirm-verification/${token}`,
      { withCredentials: true }
    );
    await sleep(1000); // ⏳ Add delay
    return response.data;
  } catch (error) {
    throw error;
  }
};

const loginUser = async (formData) => {
  try {
    const response = await axios.post(`${baseAuthURL}/login`, formData, {
      withCredentials: true,
    });
    await sleep(1000); // ⏳ Add delay
    return response.data;
  } catch (error) {
    throw error;
  }
};

const logoutUser = async () => {
  try {
    const response = await axios.post(
      `${baseAuthURL}/logout`,
      {},
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const forgotPassword = async (formData) => {
  try {
    const response = await axios.post(
      `${baseAuthURL}/forgot-password`,
      formData,
      {
        withCredentials: true,
      }
    );
    await sleep(1000); // ⏳ Add delay
    return response.data;
  } catch (error) {
    throw error;
  }
};

const otpVerification = async (formData) => {
  try {
    const response = await axios.post(
      `${baseAuthURL}/otp-verification`,
      formData,
      {
        withCredentials: true,
      }
    );
    await sleep(1000); // ⏳ Add delay
    return response.data;
  } catch (error) {
    throw error;
  }
};

const resetPassword = async (formData) => {
  try {
    const response = await axios.post(
      `${baseAuthURL}/reset-password`,
      formData,
      {
        withCredentials: true,
      }
    );
    await sleep(1000); // ⏳ Add delay
    return response.data;
  } catch (error) {
    throw error;
  }
};

const googleLogin = async (formData) => {
  try {
    const response = await axios.post(`${baseAuthURL}/google-login`, formData, {
      withCredentials: true,
    });
    await sleep(1000); // ⏳ Add delay
    return response.data;
  } catch (error) {
    throw error;
  }
};

const authService = {
  registerUser,
  verificationUser,
  loginUser,
  otpVerification,
  logoutUser,
  resetPassword,
  googleLogin,
  forgotPassword,
};
export default authService;
