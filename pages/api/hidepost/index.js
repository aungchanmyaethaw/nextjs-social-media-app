import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method === "POST" && req.body.hidePostId) {
    const { hidePostId } = req.body;

    await prisma.hidepost.delete({
      where: {
        id: hidePostId,
      },
    });

    return res.status(200).json({ msg: "hide removed" });
  }

  if (req.method === "POST" && req.body.userId && req.body.postId) {
    const { userId, postId } = req.body;

    const response = await prisma.hidepost.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        post: {
          connect: {
            id: postId,
          },
        },
      },
    });

    return res.status(201).json({ id: response.id });
  }

  return res.status(501).json({ msg: "Something broke!" });
}
