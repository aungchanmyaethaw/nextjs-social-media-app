import nc from "next-connect";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const handler = nc({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).end("Something broke!");
  },
  onNoMatch: (req, res) => {
    res.status(404).end("not found");
  },
}).delete(async (req, res) => {
  const { id, publicid } = req.query;

  await cloudinary.uploader.destroy(publicid);

  await prisma.image.delete({
    where: {
      id: id,
    },
  });

  return res.status(200).json({ msg: "image deleted!" });
});

export default handler;
