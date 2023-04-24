import axios from "axios";

export const addPostHide = async (data) => {
  try {
    const res = await axios.post("/api/hidepost", data);
    return res.data.id;
  } catch (error) {
    throw new Error(error.message);
  }
};
export const removePostHide = async (hidePostId) => {
  try {
    await axios.post("/api/hidepost", { hidePostId });
  } catch (error) {
    throw new Error(error.message);
  }
};
