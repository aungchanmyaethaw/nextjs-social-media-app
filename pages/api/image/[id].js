import nc from "next-connect";

const handler = nc({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).end("Something broke!");
  },
  onNoMatch: (req, res) => {
    res.status(404).end("not found");
  },
}).delete(async (req, res) => {
  const { id } = req.query;

  await prisma.image.delete({
    where: {
      id: id,
    },
  });

  return res.status(200).json({ msg: "image deleted!" });
});

export default handler;
