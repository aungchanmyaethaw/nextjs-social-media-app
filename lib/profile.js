import axios from "axios";

export const getProfilePosts = async (prisma, userId) => {
  const result = await prisma.post.findMany({
    where: {
      authorId: userId,
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

  return result;
};

export const getOtherProfilePosts = async (prisma, userId) => {
  const result = await prisma.post.findMany({
    where: {
      authorId: userId,
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

  return result;
};

export const getUserData = async (prisma, userId) => {
  const result = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  return result;
};

export const editProfile = async (data) => {
  const formData = new FormData();
  formData.append("username", data.username);

  if (data.image) {
    formData.append("image", data.image);
  }

  try {
    const response = await axios.patch(
      `/api/profile/${data.userId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data;
  } catch (error) {
    throw new Error(error.message);
  }
};
