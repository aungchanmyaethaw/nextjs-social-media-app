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
      },
    });

    return res.status(200).json({ data: result });
  }

  if (req.method === "POST" && req.body.userId) {
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

  return res.status(501).json({ msg: "Something Broke!" });
}
