import axios from "axios";
const baseAuthURL = import.meta.env.VITE_BASE_API_BACKEND_CATEGORY_URL;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const addCatigory = async (formData) => {
  try {
    const response = await axios.post(`${baseAuthURL}/add-catigory`, formData, {
      withCredentials: true,
    });
    await sleep(1000); // ⏳ Add delay
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const showCatigory = async (id) => {
  try {
    const response = await axios.get(
      `${baseAuthURL}/show-catigory/${id}`,

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

const showAllCatigory = async () => {
  try {
    const response = await axios.get(`${baseAuthURL}/showall-catigory`, {
      withCredentials: true,
    });
    await sleep(1000); // delay
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteCatigory = async (id) => {
  try {
    const response = await axios.delete(
      `${baseAuthURL}/del-catigory/${id}?confirm=true`,

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

const updateCatigory = async ({ id, formData }) => {
  try {
    const response = await axios.put(
      `${baseAuthURL}/update-catigory/${id}`,
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

const categoryService = {
  showCatigory,
  showAllCatigory,
  addCatigory,
  deleteCatigory,
  updateCatigory,
};
export default categoryService;
