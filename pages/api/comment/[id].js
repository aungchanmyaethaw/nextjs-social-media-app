import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    const result = await prisma.comment.findMany({
      where: {
        postId: id,
      },
      include: {
        user: true,
        post: true,
      },
    });

    return res.status(200).json({ data: result });
  }

  if (req.method === "POST") {
    const { id } = req.query;
    const { comment, userId } = req.body;
    await prisma.comment.create({
      data: {
        comment,
        post: {
          connect: {
            id: id,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return res.status(201).json({ msg: "hello" });
  }

  if (req.method === "DELETE") {
    const { commentid } = req.query;

    await prisma.comment.delete({
      where: {
        id: commentid,
      },
    });

    return res.status(200).json({ msg: "delete comment" });
  }

  if (req.method === "PATCH") {
    const { comment, commentId } = req.body;

    await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        comment,
      },
    });

    return res.status(201).json({ msg: " comment updated!" });
  }

  return res.status(501).json({ msg: "Something Broke!" });
}
