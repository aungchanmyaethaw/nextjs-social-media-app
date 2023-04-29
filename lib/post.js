import axios from "axios";

export const getPosts = async (prisma, userId) => {
  const posts = await prisma.post.findMany({
    where: {
      onlyMe: false,
      NOT: {
        hideposts: {
          some: {
            user: {
              id: userId,
            },
          },
        },
      },
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

export const getPost = async (prisma, postId) => {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: {
      images: true,
    },
  });

  return post;
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
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deletePost = async ({ postId, imagePublicIds }) => {
  try {
    await axios.post(`/api/posts/${postId}`, { imagePublicIds });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const editPost = async ({ postId, caption, onlyMe }) => {
  try {
    await axios.patch(`/api/posts/${postId}`, { caption, onlyMe });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const editPostImageUpload = async ({ postId, images }) => {
  const formData = new FormData();

  formData.append("postId", postId);

  for (const image of images) {
    formData.append("images", image);
  }

  try {
    const response = await axios.post("/api/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteImage = async ({ imageId, publicId }) => {
  try {
    await axios.delete(`/api/image/${imageId}?publicid=${publicId}`);
  } catch (error) {
    throw new Error(error.message);
  }
};
