import axios from "axios";

// favourite

export const getSavedPosts = async (postId) => {
  try {
    const res = await axios.get(`/api/save/${postId}`);
    return res.data.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const addSave = async ({ userId, postId }) => {
  try {
    await axios.post(`/api/save/${postId}`, { userId });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const removeSave = async ({ postId, savedId }) => {
  try {
    await axios.post(`/api/save/${postId}`, { savedId });
  } catch (error) {
    throw new Error(error.message);
  }
};
