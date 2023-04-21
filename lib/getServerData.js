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
