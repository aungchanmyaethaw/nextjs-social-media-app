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

// favourite

export const getLikesByPost = async (postId) => {
  try {
    const res = await axios.get(`/api/favourite/${postId}`);
    return res.data.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const addLike = async ({ userId, postId }) => {
  try {
    await axios.post(`/api/favourite/${postId}`, { userId });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const removeLike = async ({ postId, likeId }) => {
  try {
    await axios.post(`/api/favourite/${postId}`, { likeId });
  } catch (error) {
    throw new Error(error.message);
  }
};
