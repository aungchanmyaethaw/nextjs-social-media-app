import nc from "next-connect";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    const { id, publicid } = req.query;

    await cloudinary.uploader.destroy(publicid);

    await prisma.image.delete({
      where: {
        id: id,
      },
    });

    return res.status(200).json({ msg: "image deleted!" });
  }

  return res.status(501).json({ msg: "Something broke!" });
}
