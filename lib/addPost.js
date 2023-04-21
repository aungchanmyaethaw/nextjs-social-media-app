import axios from "axios";

export const addPost = async (data) => {
  console.log(data);

  const formData = new FormData();
  for (const image of data.images) {
    formData.append("images", image);
  }
  formData.append("caption", data.caption);
  formData.append("authorId", data.id);
  formData.append("onlyMe", data.onlyMe);

  try {
    const response = await axios.post("/api/posts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(response);
  } catch (error) {
    throw new Error(error.message);
  }
};
