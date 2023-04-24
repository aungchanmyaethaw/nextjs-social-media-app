const { default: axios } = require("axios");

export const addComment = async ({ data, commentPostId }) => {
  try {
    await axios.post(`/api/comment/${commentPostId}`, JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getComments = async (commentPostId) => {
  try {
    const res = await axios.get(`/api/comment/${commentPostId}`);
    return res.data.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteComment = async ({ commentPostId, commentId }) => {
  try {
    await axios.delete(`/api/comment/${commentPostId}?commentid=${commentId}`);
  } catch (error) {
    throw new Error(error.message);
  }
};
export const editComment = async ({ commentPostId, comment, commentId }) => {
  try {
    await axios.patch(`/api/comment/${commentPostId}`, { comment, commentId });
  } catch (error) {
    throw new Error(error.message);
  }
};
