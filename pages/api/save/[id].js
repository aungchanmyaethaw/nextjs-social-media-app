import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    const result = await prisma.save.findMany({
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
    const { userId } = req.body;

    await prisma.save.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        post: {
          connect: {
            id: id,
          },
        },
      },
    });

    return res.status(201).json({ msg: "add Like" });
  }

  if (req.method === "POST" && req.body.savedId) {
    const { savedId } = req.body;

    await prisma.save.delete({
      where: {
        id: savedId,
      },
    });

    return res.status(201).json({ msg: "remove save" });
  }

  return res.status(501).json({ msg: "Something Broke!" });
}
