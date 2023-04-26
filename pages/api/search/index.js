import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { q } = req.query;

    if (q === "") {
      return res.status(200).json({ data: [] });
    }

    const result = await prisma.user.findMany({
      where: { username: { contains: q } },

      orderBy: [
        {
          updatedAt: "desc",
        },
      ],
    });

    return res.status(200).json({ data: result });
  }

  return res.status(501).json({ msg: "Something broke!" });
}
