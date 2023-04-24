import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    const result = await prisma.favourite.findMany({
      where: {
        postId: id,
      },
      include: {
        user: true,
      },
    });

    return res.status(200).json({ data: result });
  }

  if (req.method === "POST") {
    const { userId } = req.body;

    await prisma.favourite.create({
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

  if (req.method === "DELETE") {
    const { likeid } = req.query;

    await prisma.favourite.delete({
      where: {
        id: likeid,
      },
    });

    return res.status(201).json({ msg: "delete Like" });
  }

  return res.status(501).json({ msg: "Something Broke!" });
}
