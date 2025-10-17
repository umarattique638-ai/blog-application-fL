import axios from "axios";
const baseAuthURL = import.meta.env.VITE_BASE_API_BACKEND_USER_URL;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const showUser = async (id) => {
  try {
    const response = await axios.get(
      `${baseAuthURL}/showuser/${id}`,
      {},
      {
        withCredentials: true,
      }
    );
    await sleep(1000); // ⏳ Add delay
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateUser = async (id, formData) => {
  try {
    const response = await axios.put(
      `${baseAuthURL}/updateuser/${id}`,
      formData,
      {
        withCredentials: true,
      }
    );
    await sleep(1000); // ⏳ Add delay
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${baseAuthURL}/deleteuser/${id}`, {
      withCredentials: true, // This tells axios to send cookies with the request
    });
    await sleep(1000); // optional delay
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const userService = {
  updateUser,
  deleteUser,
  showUser,
};
export default userService;
