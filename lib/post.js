import axios from "axios";

export const getPosts = async (prisma) => {
  const posts = await prisma.post.findMany({
    where: {
      onlyMe: false,
    },
    include: {
      images: true,
      author: true,
    },
    orderBy: [
      {
        updatedAt: "desc",
      },
    ],
  });

  return posts;
};

export const addPost = async (data) => {
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
