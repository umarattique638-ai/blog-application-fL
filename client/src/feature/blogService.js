import axios from "axios";
const baseBlogURL = import.meta.env.VITE_BASE_API_BACKEND_BLOG_URL;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const addBlog = async (formData) => {
  try {
    const response = await axios.post(`${baseBlogURL}/add-blog`, formData, {
      withCredentials: true,
    });
    await sleep(1000); // ⏳ Add delay
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const showBlog = async (id) => {
  try {
    const response = await axios.get(
      `${baseBlogURL}/show-blog/${id}`,

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

const showallBlog = async () => {
  try {
    const response = await axios.get(`${baseBlogURL}/showall-blog`, {
      withCredentials: true,
    });
    await sleep(1000); // delay
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteBlog = async (id) => {
  try {
    const response = await axios.delete(
      `${baseBlogURL}/delete-blog/${id}?confirm=true`,

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

const updateBlog = async ({ id, formData }) => {
  try {
    const response = await axios.put(
      `${baseBlogURL}/update-blog/${id}`,
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

const blogService = {
  addBlog,
  showBlog,
  showallBlog,
  addBlog,
  deleteBlog,
  updateBlog,
};
export default blogService;
